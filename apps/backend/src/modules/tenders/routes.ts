import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenderController } from './controller';
import { tenderReportController } from './reports';

const router = Router();
router.use(authenticate);

// Tender CRUD operations
router.get('/', tenderController.getAllTenders.bind(tenderController));
router.post('/', tenderController.createTender.bind(tenderController));
router.get('/stats', tenderController.getTenderStats.bind(tenderController));
router.get('/:id', tenderController.getTenderById.bind(tenderController));
router.put('/:id', tenderController.updateTender.bind(tenderController));
router.delete('/:id', tenderController.deleteTender.bind(tenderController));

// Tender items and milestones
router.post('/:id/items', tenderController.addTenderItems.bind(tenderController));
router.post('/:id/milestones', tenderController.addTenderMilestones.bind(tenderController));

// Document purchase
router.post('/:id/purchase-documents', tenderController.purchaseDocuments.bind(tenderController));

// Bid submission
router.post('/:id/submit-bid', tenderController.submitBid.bind(tenderController));

// Tender evaluation
router.post('/:id/evaluate', tenderController.evaluateTender.bind(tenderController));

// Award tender
router.post('/:id/award', tenderController.awardTender.bind(tenderController));

// Create work order from tender
router.post('/:id/create-work-order', tenderController.createWorkOrder.bind(tenderController));

// Reports
router.get('/reports/summary', tenderReportController.getTenderSummary.bind(tenderReportController));
router.get('/reports/bid-analysis', tenderReportController.getBidAnalysis.bind(tenderReportController));
router.get('/reports/vendor-performance', tenderReportController.getVendorPerformance.bind(tenderReportController));
router.get('/reports/milestone-progress', tenderReportController.getMilestoneProgress.bind(tenderReportController));
router.get('/reports/financial-summary', tenderReportController.getFinancialSummary.bind(tenderReportController));
router.get('/:id/report', tenderReportController.getTenderReport.bind(tenderReportController));

export default router;
