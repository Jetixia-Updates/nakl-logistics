import { Request, Response } from 'express';
import { prisma } from '../../config/postgres';
import { logger } from '../../utils/logger';

export class TenderController {
  // Get all tenders with filtering and pagination
  async getAllTenders(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (status) where.status = status;
      if (type) where.type = type;
      if (search) {
        where.OR = [
          { tenderNumber: { contains: search as string, mode: 'insensitive' } },
          { title: { contains: search as string, mode: 'insensitive' } },
          { titleAr: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [tenders, total] = await Promise.all([
        prisma.tender.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            bids: {
              select: {
                id: true,
                bidNumber: true,
                status: true,
                totalAmount: true,
              },
            },
            _count: {
              select: {
                bids: true,
                documentPurchases: true,
              },
            },
          },
        }),
        prisma.tender.count({ where }),
      ]);

      res.json({
        data: tenders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      logger.error('Error fetching tenders:', error);
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  }

  // Get tender by ID
  async getTenderById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tender = await prisma.tender.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: true,
          documents: true,
          milestones: {
            orderBy: { milestoneNumber: 'asc' },
          },
          bids: {
            include: {
              vendor: {
                select: {
                  id: true,
                  name: true,
                  nameAr: true,
                  code: true,
                },
              },
              items: true,
            },
          },
          documentPurchases: {
            include: {
              vendor: {
                select: {
                  id: true,
                  name: true,
                  nameAr: true,
                },
              },
            },
          },
          evaluations: {
            include: {
              evaluatedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      res.json({ data: tender });
    } catch (error) {
      logger.error('Error fetching tender:', error);
      res.status(500).json({ error: 'Failed to fetch tender' });
    }
  }

  // Create new tender
  async createTender(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const data = req.body;

      // Generate tender number
      const lastTender = await prisma.tender.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { tenderNumber: true },
      });

      const nextNumber = lastTender
        ? parseInt(lastTender.tenderNumber.split('-')[1]) + 1
        : 1;
      const tenderNumber = `TND-${String(nextNumber).padStart(6, '0')}`;

      const tender = await prisma.tender.create({
        data: {
          ...data,
          tenderNumber,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      logger.info(`Tender created: ${tender.tenderNumber}`);
      res.status(201).json({ data: tender });
    } catch (error) {
      logger.error('Error creating tender:', error);
      res.status(500).json({ error: 'Failed to create tender' });
    }
  }

  // Update tender
  async updateTender(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const tender = await prisma.tender.update({
        where: { id },
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      logger.info(`Tender updated: ${tender.tenderNumber}`);
      res.json({ data: tender });
    } catch (error) {
      logger.error('Error updating tender:', error);
      res.status(500).json({ error: 'Failed to update tender' });
    }
  }

  // Delete tender
  async deleteTender(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.tender.delete({ where: { id } });

      logger.info(`Tender deleted: ${id}`);
      res.json({ message: 'Tender deleted successfully' });
    } catch (error) {
      logger.error('Error deleting tender:', error);
      res.status(500).json({ error: 'Failed to delete tender' });
    }
  }

  // Purchase tender documents
  async purchaseDocuments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { vendorId, paymentMethod, paymentRef } = req.body;

      const tender = await prisma.tender.findUnique({ where: { id } });
      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      // Generate purchase number
      const lastPurchase = await prisma.documentPurchase.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { purchaseNumber: true },
      });

      const nextNumber = lastPurchase
        ? parseInt(lastPurchase.purchaseNumber.split('-')[1]) + 1
        : 1;
      const purchaseNumber = `DOC-${String(nextNumber).padStart(6, '0')}`;

      const purchase = await prisma.documentPurchase.create({
        data: {
          purchaseNumber,
          tenderId: id,
          vendorId,
          amount: tender.documentPrice,
          paymentMethod,
          paymentRef,
          status: 'PAID',
        },
        include: {
          tender: {
            select: {
              tenderNumber: true,
              title: true,
              titleAr: true,
            },
          },
          vendor: {
            select: {
              name: true,
              nameAr: true,
            },
          },
        },
      });

      logger.info(`Documents purchased: ${purchaseNumber}`);
      res.status(201).json({ data: purchase });
    } catch (error) {
      logger.error('Error purchasing documents:', error);
      res.status(500).json({ error: 'Failed to purchase documents' });
    }
  }

  // Submit bid
  async submitBid(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { vendorId, totalAmount, items, documents } = req.body;

      const tender = await prisma.tender.findUnique({ where: { id } });
      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      // Check if vendor purchased documents
      const hasPurchased = await prisma.documentPurchase.findFirst({
        where: {
          tenderId: id,
          vendorId,
          status: 'PAID',
        },
      });

      if (!hasPurchased) {
        return res.status(400).json({
          error: 'Vendor must purchase tender documents before submitting bid',
        });
      }

      // Generate bid number
      const lastBid = await prisma.bid.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { bidNumber: true },
      });

      const nextNumber = lastBid
        ? parseInt(lastBid.bidNumber.split('-')[1]) + 1
        : 1;
      const bidNumber = `BID-${String(nextNumber).padStart(6, '0')}`;

      const bid = await prisma.bid.create({
        data: {
          bidNumber,
          tenderId: id,
          vendorId,
          totalAmount,
          currency: tender.currency,
          status: 'SUBMITTED',
          submittedDate: new Date(),
          items: {
            create: items,
          },
        },
        include: {
          vendor: {
            select: {
              name: true,
              nameAr: true,
            },
          },
          items: true,
        },
      });

      logger.info(`Bid submitted: ${bidNumber}`);
      res.status(201).json({ data: bid });
    } catch (error) {
      logger.error('Error submitting bid:', error);
      res.status(500).json({ error: 'Failed to submit bid' });
    }
  }

  // Award tender
  async awardTender(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { bidId, awardDate, workStartDate, workEndDate } = req.body;

      // Update bid status to WINNER
      await prisma.bid.update({
        where: { id: bidId },
        data: { status: 'WINNER' },
      });

      // Update tender status
      const tender = await prisma.tender.update({
        where: { id },
        data: {
          status: 'AWARDED',
          awardDate: awardDate || new Date(),
          workStartDate,
          workEndDate,
        },
        include: {
          bids: {
            where: { id: bidId },
            include: {
              vendor: true,
            },
          },
        },
      });

      logger.info(`Tender awarded: ${tender.tenderNumber}`);
      res.json({ data: tender });
    } catch (error) {
      logger.error('Error awarding tender:', error);
      res.status(500).json({ error: 'Failed to award tender' });
    }
  }

  // Get tender statistics
  async getTenderStats(req: Request, res: Response) {
    try {
      const [
        totalTenders,
        activeTenders,
        completedTenders,
        totalBids,
        totalValue,
      ] = await Promise.all([
        prisma.tender.count(),
        prisma.tender.count({
          where: {
            status: {
              in: ['PUBLISHED', 'SUBMISSION_OPEN', 'UNDER_EVALUATION'],
            },
          },
        }),
        prisma.tender.count({ where: { status: 'COMPLETED' } }),
        prisma.bid.count(),
        prisma.tender.aggregate({
          _sum: { estimatedValue: true },
        }),
      ]);

      res.json({
        data: {
          totalTenders,
          activeTenders,
          completedTenders,
          totalBids,
          totalValue: totalValue._sum.estimatedValue || 0,
        },
      });
    } catch (error) {
      logger.error('Error fetching tender stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }

  // Add tender items
  async addTenderItems(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { items } = req.body;

      const createdItems = await prisma.tenderItem.createMany({
        data: items.map((item: any) => ({
          ...item,
          tenderId: id,
        })),
      });

      logger.info(`Added ${createdItems.count} items to tender ${id}`);
      res.status(201).json({ data: createdItems });
    } catch (error) {
      logger.error('Error adding tender items:', error);
      res.status(500).json({ error: 'Failed to add tender items' });
    }
  }

  // Add tender milestones
  async addTenderMilestones(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { milestones } = req.body;

      const createdMilestones = await prisma.tenderMilestone.createMany({
        data: milestones.map((milestone: any) => ({
          ...milestone,
          tenderId: id,
        })),
      });

      logger.info(`Added ${createdMilestones.count} milestones to tender ${id}`);
      res.status(201).json({ data: createdMilestones });
    } catch (error) {
      logger.error('Error adding tender milestones:', error);
      res.status(500).json({ error: 'Failed to add tender milestones' });
    }
  }

  // Evaluate tender
  async evaluateTender(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { evaluationType, criteria, weights, report, reportAr, recommendation } = req.body;

      const evaluation = await prisma.tenderEvaluation.create({
        data: {
          tenderId: id,
          evaluationType,
          criteria,
          weights,
          report,
          reportAr,
          recommendation,
          evaluatedById: userId!,
        },
        include: {
          evaluatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      logger.info(`Tender evaluation created for tender ${id}`);
      res.status(201).json({ data: evaluation });
    } catch (error) {
      logger.error('Error evaluating tender:', error);
      res.status(500).json({ error: 'Failed to evaluate tender' });
    }
  }

  // Create work order from tender
  async createWorkOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerId, vendorId, description, descriptionAr, startDate, endDate } = req.body;

      const tender = await prisma.tender.findUnique({
        where: { id },
        include: {
          bids: {
            where: { status: 'WINNER' },
          },
        },
      });

      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      const winningBid = tender.bids[0];
      if (!winningBid) {
        return res.status(400).json({ error: 'No winning bid found for this tender' });
      }

      // Generate work order number
      const lastWorkOrder = await prisma.workOrder.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true },
      });

      const nextNumber = lastWorkOrder
        ? parseInt(lastWorkOrder.orderNumber.split('-')[1]) + 1
        : 1;
      const orderNumber = `WO-${String(nextNumber).padStart(6, '0')}`;

      const workOrder = await prisma.workOrder.create({
        data: {
          orderNumber,
          tenderId: id,
          customerId,
          vendorId: vendorId || winningBid.vendorId,
          description: description || tender.description,
          descriptionAr: descriptionAr || tender.descriptionAr,
          startDate: startDate || tender.workStartDate,
          endDate: endDate || tender.workEndDate,
          totalAmount: winningBid.totalAmount,
          status: 'ASSIGNED',
        },
        include: {
          tender: {
            select: {
              tenderNumber: true,
              title: true,
            },
          },
          customer: {
            select: {
              name: true,
              nameAr: true,
            },
          },
          vendor: {
            select: {
              name: true,
              nameAr: true,
            },
          },
        },
      });

      // Update tender status
      await prisma.tender.update({
        where: { id },
        data: { status: 'WORK_IN_PROGRESS' },
      });

      logger.info(`Work order created: ${orderNumber}`);
      res.status(201).json({ data: workOrder });
    } catch (error) {
      logger.error('Error creating work order:', error);
      res.status(500).json({ error: 'Failed to create work order' });
    }
  }
}

export const tenderController = new TenderController();
