import { Request, Response } from 'express';
import prisma from '../../config/postgres';
import { logger } from '../../utils/logger';

export class TenderReportController {
  // Get comprehensive tender report
  async getTenderReport(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tender = await prisma.tender.findUnique({
        where: { id },
        include: {
          createdBy: true,
          items: true,
          documents: true,
          milestones: true,
          bids: {
            include: {
              vendor: true,
              items: true,
            },
          },
          documentPurchases: {
            include: {
              vendor: true,
            },
          },
          evaluations: {
            include: {
              evaluatedBy: true,
            },
          },
          workOrders: {
            include: {
              customer: true,
              vendor: true,
            },
          },
        },
      });

      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      // Calculate statistics
      const stats = {
        totalBids: tender.bids.length,
        totalDocumentPurchases: tender.documentPurchases.length,
        totalItems: tender.items.length,
        totalMilestones: tender.milestones.length,
        completedMilestones: tender.milestones.filter((m: any) => m.status === 'COMPLETED').length,
        averageBidAmount:
          tender.bids.length > 0
            ? tender.bids.reduce((sum: number, bid: any) => sum + Number(bid.totalAmount), 0) /
              tender.bids.length
            : 0,
        lowestBid:
          tender.bids.length > 0
            ? Math.min(...tender.bids.map((bid: any) => Number(bid.totalAmount)))
            : 0,
        highestBid:
          tender.bids.length > 0
            ? Math.max(...tender.bids.map((bid: any) => Number(bid.totalAmount)))
            : 0,
        documentRevenue:
          Number(tender.documentPrice) * tender.documentPurchases.length,
      };

      // Timeline analysis
      const timeline = {
        publishDate: tender.publishDate,
        documentSaleStart: tender.documentSaleStart,
        documentSaleEnd: tender.documentSaleEnd,
        submissionDeadline: tender.submissionDeadline,
        openingDate: tender.openingDate,
        awardDate: tender.awardDate,
        workStartDate: tender.workStartDate,
        workEndDate: tender.workEndDate,
        daysUntilDeadline: tender.submissionDeadline
          ? Math.ceil(
              (new Date(tender.submissionDeadline).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
        totalDuration: tender.workStartDate && tender.workEndDate
          ? Math.ceil(
              (new Date(tender.workEndDate).getTime() -
                new Date(tender.workStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      };

      // Vendor analysis
      const vendorAnalysis = tender.bids.map((bid: any) => ({
        vendor: bid.vendor,
        bidAmount: bid.totalAmount,
        status: bid.status,
        submittedDate: bid.submittedDate,
        technicalScore: bid.technicalScore,
        financialScore: bid.financialScore,
        totalScore: bid.totalScore,
        deviationFromEstimate: Number(bid.totalAmount) - Number(tender.estimatedValue),
        deviationPercentage:
          ((Number(bid.totalAmount) - Number(tender.estimatedValue)) /
            Number(tender.estimatedValue)) *
          100,
      }));

      const report = {
        tender,
        stats,
        timeline,
        vendorAnalysis,
        generatedAt: new Date(),
      };

      res.json({ data: report });
    } catch (error) {
      logger.error('Error generating tender report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  // Get tender summary report
  async getTenderSummary(req: Request, res: Response) {
    try {
      const { startDate, endDate, status, type } = req.query;

      const where: any = {};

      if (startDate && endDate) {
        where.publishDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      if (status) where.status = status;
      if (type) where.type = type;

      const tenders = await prisma.tender.findMany({
        where,
        include: {
          _count: {
            select: {
              bids: true,
              documentPurchases: true,
              items: true,
            },
          },
        },
      });

      const summary = {
        totalTenders: tenders.length,
        totalEstimatedValue: tenders.reduce(
          (sum: number, t: any) => sum + Number(t.estimatedValue),
          0
        ),
        averageEstimatedValue:
          tenders.length > 0
            ? tenders.reduce((sum: number, t: any) => sum + Number(t.estimatedValue), 0) /
              tenders.length
            : 0,
        totalBids: tenders.reduce((sum: number, t: any) => sum + t._count.bids, 0),
        averageBidsPerTender:
          tenders.length > 0
            ? tenders.reduce((sum: number, t: any) => sum + t._count.bids, 0) / tenders.length
            : 0,
        totalDocumentPurchases: tenders.reduce(
          (sum: number, t: any) => sum + t._count.documentPurchases,
          0
        ),
        documentRevenue: tenders.reduce(
          (sum: number, t: any) => sum + Number(t.documentPrice) * t._count.documentPurchases,
          0
        ),
        statusBreakdown: tenders.reduce((acc: any, t: any) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {}),
        typeBreakdown: tenders.reduce((acc: any, t: any) => {
          acc[t.type] = (acc[t.type] || 0) + 1;
          return acc;
        }, {}),
      };

      res.json({ data: summary });
    } catch (error) {
      logger.error('Error generating tender summary:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  }

  // Get bid analysis report
  async getBidAnalysis(req: Request, res: Response) {
    try {
      const { tenderId } = req.query;

      const where: any = {};
      if (tenderId) where.tenderId = tenderId;

      const bids = await prisma.bid.findMany({
        where,
        include: {
          tender: {
            select: {
              tenderNumber: true,
              title: true,
              titleAr: true,
              estimatedValue: true,
            },
          },
          vendor: {
            select: {
              name: true,
              nameAr: true,
              code: true,
              rating: true,
            },
          },
          items: true,
        },
      });

      const analysis = bids.map((bid: any) => {
        const deviation = Number(bid.totalAmount) - Number(bid.tender.estimatedValue);
        const deviationPercentage =
          (deviation / Number(bid.tender.estimatedValue)) * 100;

        return {
          bidNumber: bid.bidNumber,
          tender: bid.tender,
          vendor: bid.vendor,
          totalAmount: bid.totalAmount,
          status: bid.status,
          submittedDate: bid.submittedDate,
          technicalScore: bid.technicalScore,
          financialScore: bid.financialScore,
          totalScore: bid.totalScore,
          deviation,
          deviationPercentage,
          itemCount: bid.items.length,
          competitiveness:
            deviationPercentage < -10
              ? 'Highly Competitive'
              : deviationPercentage < 0
              ? 'Competitive'
              : deviationPercentage < 10
              ? 'Fair'
              : 'High',
        };
      });

      // Sort by total score descending
      analysis.sort((a: any, b: any) => Number(b.totalScore || 0) - Number(a.totalScore || 0));

      res.json({ data: analysis });
    } catch (error) {
      logger.error('Error generating bid analysis:', error);
      res.status(500).json({ error: 'Failed to generate bid analysis' });
    }
  }

  // Get vendor performance report
  async getVendorPerformance(req: Request, res: Response) {
    try {
      const { vendorId, startDate, endDate } = req.query;

      const where: any = {};
      if (vendorId) where.vendorId = vendorId;

      const bids = await prisma.bid.findMany({
        where,
        include: {
          tender: {
            select: {
              tenderNumber: true,
              title: true,
              titleAr: true,
              status: true,
              estimatedValue: true,
              publishDate: true,
            },
          },
          vendor: true,
        },
      });

      const vendorStats: any = {};

      bids.forEach((bid: any) => {
        const vendorId = bid.vendorId;
        if (!vendorStats[vendorId]) {
          vendorStats[vendorId] = {
            vendor: bid.vendor,
            totalBids: 0,
            wonBids: 0,
            totalBidAmount: 0,
            averageBidAmount: 0,
            winRate: 0,
            averageScore: 0,
            scores: [],
          };
        }

        vendorStats[vendorId].totalBids++;
        vendorStats[vendorId].totalBidAmount += Number(bid.totalAmount);
        
        if (bid.status === 'WINNER') {
          vendorStats[vendorId].wonBids++;
        }

        if (bid.totalScore) {
          vendorStats[vendorId].scores.push(Number(bid.totalScore));
        }
      });

      // Calculate averages and rates
      Object.keys(vendorStats).forEach((vendorId) => {
        const stats = vendorStats[vendorId];
        stats.averageBidAmount = stats.totalBidAmount / stats.totalBids;
        stats.winRate = (stats.wonBids / stats.totalBids) * 100;
        
        if (stats.scores.length > 0) {
          stats.averageScore =
            stats.scores.reduce((sum: number, score: number) => sum + score, 0) /
            stats.scores.length;
        }
        
        delete stats.scores;
      });

      const performance = Object.values(vendorStats);

      // Sort by win rate descending
      performance.sort((a: any, b: any) => b.winRate - a.winRate);

      res.json({ data: performance });
    } catch (error) {
      logger.error('Error generating vendor performance report:', error);
      res.status(500).json({ error: 'Failed to generate vendor performance' });
    }
  }

  // Get milestone progress report
  async getMilestoneProgress(req: Request, res: Response) {
    try {
      const { tenderId } = req.query;

      const where: any = {};
      if (tenderId) where.tenderId = tenderId;

      const milestones = await prisma.tenderMilestone.findMany({
        where,
        include: {
          tender: {
            select: {
              tenderNumber: true,
              title: true,
              titleAr: true,
              status: true,
            },
          },
        },
        orderBy: [{ tenderId: 'asc' }, { milestoneNumber: 'asc' }],
      });

      // Group by tender
      const tenderProgress: any = {};

      milestones.forEach((milestone: any) => {
        const tenderId = milestone.tenderId;
        if (!tenderProgress[tenderId]) {
          tenderProgress[tenderId] = {
            tender: milestone.tender,
            milestones: [],
            totalAmount: 0,
            completedAmount: 0,
            overallProgress: 0,
            completedCount: 0,
            totalCount: 0,
          };
        }

        tenderProgress[tenderId].milestones.push({
          milestoneNumber: milestone.milestoneNumber,
          title: milestone.title,
          titleAr: milestone.titleAr,
          percentage: milestone.percentage,
          amount: milestone.amount,
          status: milestone.status,
          dueDate: milestone.dueDate,
          completedDate: milestone.completedDate,
        });

        tenderProgress[tenderId].totalAmount += Number(milestone.amount);
        tenderProgress[tenderId].totalCount++;

        if (milestone.status === 'COMPLETED') {
          tenderProgress[tenderId].completedAmount += Number(milestone.amount);
          tenderProgress[tenderId].completedCount++;
        }
      });

      // Calculate overall progress
      Object.keys(tenderProgress).forEach((tenderId) => {
        const progress = tenderProgress[tenderId];
        progress.overallProgress =
          (progress.completedAmount / progress.totalAmount) * 100;
      });

      const report = Object.values(tenderProgress);

      res.json({ data: report });
    } catch (error) {
      logger.error('Error generating milestone progress report:', error);
      res.status(500).json({ error: 'Failed to generate milestone progress' });
    }
  }

  // Get financial summary
  async getFinancialSummary(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};

      if (startDate && endDate) {
        where.publishDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const tenders = await prisma.tender.findMany({
        where,
        include: {
          bids: {
            where: { status: 'WINNER' },
          },
          documentPurchases: {
            where: { status: 'PAID' },
          },
        },
      });

      const financial = {
        totalEstimatedValue: tenders.reduce(
          (sum: number, t: any) => sum + Number(t.estimatedValue),
          0
        ),
        totalAwardedValue: tenders.reduce((sum: number, t: any) => {
          const winningBid = t.bids[0];
          return sum + (winningBid ? Number(winningBid.totalAmount) : 0);
        }, 0),
        savings: 0,
        savingsPercentage: 0,
        documentRevenue: tenders.reduce(
          (sum: number, t: any) =>
            sum + Number(t.documentPrice) * t.documentPurchases.length,
          0
        ),
        averageSavingsPerTender: 0,
        tendersAwarded: tenders.filter((t: any) => t.status === 'AWARDED' || t.status === 'WORK_IN_PROGRESS' || t.status === 'COMPLETED').length,
      };

      financial.savings = financial.totalEstimatedValue - financial.totalAwardedValue;
      financial.savingsPercentage =
        financial.totalEstimatedValue > 0
          ? (financial.savings / financial.totalEstimatedValue) * 100
          : 0;
      financial.averageSavingsPerTender =
        financial.tendersAwarded > 0
          ? financial.savings / financial.tendersAwarded
          : 0;

      res.json({ data: financial });
    } catch (error) {
      logger.error('Error generating financial summary:', error);
      res.status(500).json({ error: 'Failed to generate financial summary' });
    }
  }
}

export const tenderReportController = new TenderReportController();
