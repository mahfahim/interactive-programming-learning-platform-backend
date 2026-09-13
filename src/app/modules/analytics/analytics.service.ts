import {
	PaymentStatus,
	Role,
	UserStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAdminOverviewStats = async () => {
	const [
		totalUsers,
		studentsCount,
		instructorsCount,
		activeUsersCount,
		totalCourses,
		totalEnrollments,
		paidEnrollments,
		revenueAggregate,
		refundAggregate,
		totalCertificates,
	] = await Promise.all([
		prisma.user.count({ where: { isDeleted: false } }),
		prisma.user.count({ where: { role: Role.STUDENT, isDeleted: false } }),
		prisma.user.count({ where: { role: Role.INSTRUCTOR, isDeleted: false } }),
		prisma.user.count({
			where: { status: UserStatus.ACTIVE, isDeleted: false },
		}),
		prisma.course.count(),
		prisma.enrollment.count(),
		prisma.enrollment.count({ where: { isPaid: true } }),
		prisma.payment.aggregate({
			where: { status: PaymentStatus.COMPLETED },
			_sum: { amount: true },
		}),
		prisma.payment.aggregate({
			where: { status: PaymentStatus.REFUNDED },
			_sum: { refundAmount: true },
		}),
		prisma.certificate.count(),
	]);

	const totalRevenue = Number(revenueAggregate._sum.amount || 0);
	const totalRefunded = Number(refundAggregate._sum.refundAmount || 0);

	return {
		users: {
			total: totalUsers,
			students: studentsCount,
			instructors: instructorsCount,
			active: activeUsersCount,
		},
		courses: {
			total: totalCourses,
		},
		enrollments: {
			total: totalEnrollments,
			paid: paidEnrollments,
			free: totalEnrollments - paidEnrollments,
		},
		finance: {
			totalRevenue,
			totalRefunded,
			netEarnings: totalRevenue - totalRefunded,
			currency: "BDT",
		},
		achievements: {
			certificatesIssued: totalCertificates,
		},
	};
};

export const AnalyticsService = {
	getAdminOverviewStats,
};
