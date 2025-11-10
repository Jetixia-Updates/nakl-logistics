# نظام إدارة المناقصات الشامل
# Comprehensive Tender Management System

## نظرة عامة | Overview

نظام متكامل لإدارة المناقصات من البداية إلى النهاية، يشمل جميع مراحل دورة حياة المناقصة من النشر حتى التنفيذ.

A complete tender management system covering the entire lifecycle from publication to execution.

---

## المميزات الرئيسية | Key Features

### 1. إدارة المناقصات | Tender Management
- ✅ إنشاء وإدارة المناقصات بأنواعها (عامة، محدودة، مباشرة)
- ✅ تحديد البنود التفصيلية للمناقصة
- ✅ تحديد المواعيد المهمة (نشر، تقديم، فتح، إرساء)
- ✅ إرفاق المستندات (كراسة الشروط، المواصفات الفنية)
- ✅ تحديد التأمينات (ابتدائي، نهائي)

### 2. شراء كراسة الشروط | Document Purchase
- ✅ تحديد سعر كراسة الشروط
- ✅ تسجيل عمليات الشراء من الموردين
- ✅ متابعة الدفعات والفواتير
- ✅ إصدار إيصالات الشراء

### 3. تقديم العروض | Bid Submission
- ✅ تقديم العروض من الموردين المؤهلين
- ✅ تفاصيل العرض المالي والفني
- ✅ إرفاق مستندات العرض
- ✅ تتبع حالة العروض المقدمة

### 4. التقييم والمفاضلة | Evaluation
- ✅ نظام تقييم فني ومالي
- ✅ معايير التقييم المرنة
- ✅ الأوزان النسبية للمعايير
- ✅ تقارير التقييم المفصلة
- ✅ التوصيات والملاحظات

### 5. الإرساء وبدء التنفيذ | Award & Execution
- ✅ إرساء المناقصة على أفضل عرض
- ✅ إنشاء أمر عمل تلقائي
- ✅ تحديد مواعيد بدء وانتهاء العمل
- ✅ الربط مع نظام أوامر العمل

### 6. إدارة المراحل | Milestone Management
- ✅ تقسيم العمل لمراحل قابلة للقياس
- ✅ تحديد النسب المئوية والمبالغ
- ✅ متابعة التنفيذ الفعلي
- ✅ إصدار شهادات الإنجاز

### 7. التقارير والإحصائيات | Reports & Analytics
- ✅ تقرير شامل لكل مناقصة
- ✅ ملخص المناقصات حسب الفترة
- ✅ تحليل العروض والمقارنات
- ✅ أداء الموردين
- ✅ تقدم المراحل
- ✅ الملخص المالي والوفورات

---

## قاعدة البيانات | Database Schema

### الجداول الرئيسية | Main Tables

#### 1. Tender (المناقصات)
```typescript
- tenderNumber: رقم المناقصة
- type: النوع (PUBLIC, LIMITED, DIRECT, FRAMEWORK)
- status: الحالة (DRAFT, PUBLISHED, SUBMISSION_OPEN, etc.)
- estimatedValue: القيمة المقدرة
- documentPrice: سعر كراسة الشروط
- bidBond: التأمين الابتدائي
- performanceBond: التأمين النهائي
- Important dates: المواعيد المهمة
```

#### 2. TenderItem (بنود المناقصة)
```typescript
- itemNumber: رقم البند
- description: الوصف التفصيلي
- quantity: الكمية
- unit: الوحدة
- estimatedPrice: السعر المقدر
- specifications: المواصفات
```

#### 3. TenderMilestone (مراحل التنفيذ)
```typescript
- milestoneNumber: رقم المرحلة
- title: اسم المرحلة
- percentage: نسبة الإنجاز
- amount: المبلغ
- dueDate: الموعد المتوقع
- status: الحالة
```

#### 4. DocumentPurchase (شراء الكراسة)
```typescript
- purchaseNumber: رقم الشراء
- vendorId: المورد
- amount: المبلغ
- status: الحالة
- purchaseDate: تاريخ الشراء
```

#### 5. Bid (العروض)
```typescript
- bidNumber: رقم العرض
- vendorId: المورد
- totalAmount: إجمالي العرض
- status: الحالة
- technicalScore: الدرجة الفنية
- financialScore: الدرجة المالية
- totalScore: الدرجة الإجمالية
```

#### 6. TenderEvaluation (التقييم)
```typescript
- evaluationType: نوع التقييم
- criteria: المعايير
- weights: الأوزان
- report: التقرير
- recommendation: التوصية
```

#### 7. WorkOrder (أوامر العمل)
```typescript
- orderNumber: رقم الأمر
- tenderId: المناقصة المرتبطة
- customerId: العميل
- vendorId: المورد المنفذ
- status: حالة التنفيذ
```

---

## واجهات برمجة التطبيقات | API Endpoints

### Tender Management
```
GET    /api/tenders                    - جميع المناقصات
POST   /api/tenders                    - إنشاء مناقصة جديدة
GET    /api/tenders/:id                - تفاصيل مناقصة
PUT    /api/tenders/:id                - تحديث مناقصة
DELETE /api/tenders/:id                - حذف مناقصة
GET    /api/tenders/stats              - إحصائيات المناقصات
```

### Items & Milestones
```
POST   /api/tenders/:id/items          - إضافة بنود
POST   /api/tenders/:id/milestones     - إضافة مراحل
```

### Document Purchase
```
POST   /api/tenders/:id/purchase-documents  - شراء كراسة الشروط
```

### Bid Management
```
POST   /api/tenders/:id/submit-bid     - تقديم عرض
```

### Evaluation
```
POST   /api/tenders/:id/evaluate       - تقييم المناقصة
```

### Award & Work Order
```
POST   /api/tenders/:id/award          - إرساء المناقصة
POST   /api/tenders/:id/create-work-order  - إنشاء أمر عمل
```

### Reports
```
GET    /api/tenders/:id/report                 - تقرير شامل
GET    /api/tenders/reports/summary            - ملخص المناقصات
GET    /api/tenders/reports/bid-analysis       - تحليل العروض
GET    /api/tenders/reports/vendor-performance - أداء الموردين
GET    /api/tenders/reports/milestone-progress - تقدم المراحل
GET    /api/tenders/reports/financial-summary  - الملخص المالي
```

---

## دورة حياة المناقصة | Tender Lifecycle

### المراحل | Stages

1. **DRAFT (مسودة)**
   - إنشاء المناقصة الأولي
   - تحديد التفاصيل والبنود

2. **PUBLISHED (منشورة)**
   - نشر المناقصة للعموم
   - إتاحة كراسة الشروط للبيع

3. **DOCUMENT_PURCHASE (شراء الكراسة)**
   - الموردون يشترون كراسة الشروط
   - تسجيل عمليات الشراء

4. **SUBMISSION_OPEN (مفتوحة للتقديم)**
   - فترة تقديم العروض
   - الموردون يقدمون عروضهم

5. **SUBMISSION_CLOSED (مغلقة للتقديم)**
   - انتهاء موعد التقديم
   - التجهيز لفتح المظاريف

6. **UNDER_EVALUATION (تحت التقييم)**
   - فتح المظاريف
   - التقييم الفني والمالي
   - المقارنة والمفاضلة

7. **AWARDED (تم الإرساء)**
   - إرساء المناقصة
   - إبلاغ الفائز
   - إنشاء العقد

8. **WORK_IN_PROGRESS (جاري التنفيذ)**
   - بدء التنفيذ الفعلي
   - متابعة المراحل
   - إصدار الشهادات

9. **COMPLETED (مكتملة)**
   - إتمام التنفيذ
   - التسليم النهائي
   - إغلاق الملف

10. **CANCELLED (ملغاة)**
    - إلغاء المناقصة لأي سبب

---

## أمثلة الاستخدام | Usage Examples

### إنشاء مناقصة جديدة
```javascript
POST /api/tenders
{
  "type": "PUBLIC",
  "title": "Cargo Transport Cairo to Alexandria",
  "titleAr": "نقل بضائع من القاهرة إلى الإسكندرية",
  "description": "Transport 500 tons...",
  "descriptionAr": "نقل 500 طن...",
  "estimatedValue": 250000,
  "currency": "EGP",
  "documentPrice": 500,
  "bidBond": 5000,
  "performanceBond": 25000,
  "publishDate": "2024-11-01",
  "documentSaleStart": "2024-11-01",
  "documentSaleEnd": "2024-11-20",
  "submissionDeadline": "2024-11-25",
  "openingDate": "2024-11-26",
  "workStartDate": "2024-12-01",
  "workEndDate": "2025-01-31"
}
```

### شراء كراسة الشروط
```javascript
POST /api/tenders/:id/purchase-documents
{
  "vendorId": "vendor-uuid",
  "paymentMethod": "BANK_TRANSFER",
  "paymentRef": "TRX-123456"
}
```

### تقديم عرض
```javascript
POST /api/tenders/:id/submit-bid
{
  "vendorId": "vendor-uuid",
  "totalAmount": 230000,
  "items": [
    {
      "itemNumber": "1",
      "description": "Transport general cargo",
      "quantity": 300,
      "unitPrice": 450,
      "totalPrice": 135000
    }
  ]
}
```

### إرساء المناقصة
```javascript
POST /api/tenders/:id/award
{
  "bidId": "bid-uuid",
  "awardDate": "2024-11-30",
  "workStartDate": "2024-12-01",
  "workEndDate": "2025-01-31"
}
```

---

## التقارير | Reports

### 1. تقرير شامل للمناقصة
- معلومات المناقصة الأساسية
- إحصائيات العروض والمشتريات
- تحليل الجدول الزمني
- تحليل الموردين والانحرافات

### 2. ملخص المناقصات
- إجمالي المناقصات حسب الفترة
- القيم المقدرة والفعلية
- معدل العروض لكل مناقصة
- التوزيع حسب الحالة والنوع

### 3. تحليل العروض
- مقارنة العروض
- الانحرافات عن القيمة المقدرة
- التنافسية
- الدرجات والتقييمات

### 4. أداء الموردين
- عدد المناقصات المشارك فيها
- نسبة الفوز
- متوسط العروض
- متوسط الدرجات

### 5. تقدم المراحل
- حالة كل مرحلة
- النسب المكتملة
- التأخيرات
- المبالغ المستحقة

### 6. الملخص المالي
- القيمة المقدرة الإجمالية
- القيمة المرساة الفعلية
- الوفورات المحققة
- إيرادات بيع الكراسات

---

## الواجهة الأمامية | Frontend

### صفحات النظام | Pages

1. **قائمة المناقصات** (`/admin/tenders`)
   - عرض جميع المناقصات
   - البحث والتصفية
   - إحصائيات سريعة

2. **تفاصيل المناقصة** (`/admin/tenders/[id]`)
   - معلومات كاملة
   - علامات تبويب متعددة:
     * نظرة عامة
     * البنود
     * المراحل
     * المستندات
     * شراء الكراسة
     * العروض
     * الجدول الزمني

3. **صفحة التقارير** (قيد التطوير)
   - تقارير تفاعلية
   - رسوم بيانية
   - تصدير PDF/Excel

---

## التكامل مع الأنظمة الأخرى | Integration

### 1. نظام أوامر العمل
- إنشاء أمر عمل تلقائي عند الإرساء
- ربط المناقصة بأمر العمل
- متابعة التنفيذ

### 2. نظام المحاسبة
- تسجيل إيرادات بيع الكراسات
- تسجيل مصاريف التنفيذ
- إدارة الفواتير والدفعات

### 3. نظام الموردين
- تقييم أداء الموردين
- سجل المشاركة في المناقصات
- نسب الفوز والإنجاز

---

## الصلاحيات | Permissions

### أدوار النظام | System Roles

1. **مدير المناقصات**
   - إنشاء وتعديل المناقصات
   - إدارة البنود والمراحل
   - رفع المستندات

2. **لجنة التقييم**
   - مراجعة العروض
   - التقييم الفني والمالي
   - إصدار التوصيات

3. **مدير الإرساء**
   - إرساء المناقصات
   - إنشاء أوامر العمل
   - الموافقات النهائية

4. **المحاسب**
   - إدارة المدفوعات
   - التقارير المالية
   - التدقيق

5. **الموردون**
   - شراء كراسة الشروط
   - تقديم العروض
   - متابعة الحالة

---

## التطويرات المستقبلية | Future Enhancements

- [ ] نظام المزايدات الإلكترونية
- [ ] التوقيع الإلكتروني
- [ ] الإشعارات التلقائية (SMS/Email)
- [ ] تطبيق الموردين
- [ ] تكامل مع بوابة المشتريات الحكومية
- [ ] الذكاء الاصطناعي للتقييم

---

## الدعم والتواصل | Support

للمزيد من المعلومات أو الدعم الفني، يرجى التواصل مع فريق التطوير.

For more information or technical support, please contact the development team.
