# Syria Directory Platform - SQL Database WBS

## 1. Core Tables (الجداول الأساسية)

### 1.1 Business Management (إدارة الأعمال)

- **Businesses** - الأعمال التجارية الرئيسية
  - Id (Guid, PK)
  - Name (nvarchar(200)) - اسم العمل
  - Description (nvarchar(max)) - الوصف
  - Phone (nvarchar(50)) - الهاتف
  - Email (nvarchar(100)) - البريد الإلكتروني
  - Website (nvarchar(200)) - الموقع الإلكتروني
  - WorkingHours (nvarchar(500)) - ساعات العمل
  - IsActive (bit) - حالة النشاط
  - IsVerified (bit) - التحقق
  - Rating (decimal(3,2)) - التقييم العام
  - ViewCount (int) - عدد المشاهدات
  - Logo (varbinary(max)) - الشعار
  - CoverImage (varbinary(max)) - صورة الغلاف
  - AuthUserId (Guid) - معرف المالك
  - CreatedDate, UpdatedDate, DeletedDate
  - CreatedBy, UpdatedBy, DeletedBy

### 1.2 Location Management (إدارة المواقع)

- **Cities** - المدن

  - Id (Guid, PK)
  - Name (nvarchar(100)) - اسم المدينة
  - NameEn (nvarchar(100)) - الاسم بالإنجليزية
  - Code (nvarchar(10)) - رمز المدينة
  - IsActive (bit)
  - CreatedDate, UpdatedDate

- **Districts** - الأحياء/المناطق

  - Id (Guid, PK)
  - Name (nvarchar(100)) - اسم الحي
  - NameEn (nvarchar(100))
  - CityId (Guid, FK → Cities)
  - IsActive (bit)
  - CreatedDate, UpdatedDate

- **BusinessAddresses** - عناوين الأعمال
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - CityId (Guid, FK → Cities)
  - DistrictId (Guid, FK → Districts)
  - Street (nvarchar(200)) - الشارع
  - BuildingNumber (nvarchar(20)) - رقم المبنى
  - Latitude (decimal(10,8)) - خط العرض
  - Longitude (decimal(11,8)) - خط الطول
  - IsPrimary (bit) - العنوان الرئيسي
  - CreatedDate, UpdatedDate

### 1.3 Category Management (إدارة التصنيفات)

- **BusinessCategories** - فئات الأعمال

  - Id (Guid, PK)
  - Name (nvarchar(100)) - اسم الفئة
  - Description (nvarchar(500))
  - Icon (nvarchar(50)) - أيقونة FontAwesome
  - Color (nvarchar(7)) - لون hex
  - ParentCategoryId (Guid, FK → BusinessCategories) - الفئة الأب
  - SortOrder (int) - ترتيب العرض
  - IsActive (bit)
  - CreatedDate, UpdatedDate

- **BusinessCategoryMappings** - ربط الأعمال بالفئات
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - CategoryId (Guid, FK → BusinessCategories)
  - IsPrimary (bit) - الفئة الرئيسية
  - CreatedDate

## 2. Extended Features (الميزات الإضافية)

### 2.1 Reviews & Ratings (التقييمات والآراء)

- **BusinessReviews** - تقييمات الأعمال
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - AuthUserId (Guid) - معرف المقيم
  - Rating (int) - التقييم (1-5)
  - Title (nvarchar(200)) - عنوان التقييم
  - Comment (nvarchar(1000)) - التعليق
  - IsApproved (bit) - الموافقة على النشر
  - IsReported (bit) - تم الإبلاغ عنه
  - CreatedDate, UpdatedDate

### 2.2 Business Media (وسائط الأعمال)

- **BusinessImages** - صور الأعمال
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - ImageData (varbinary(max)) - بيانات الصورة
  - ImageType (nvarchar(20)) - نوع الصورة
  - Title (nvarchar(200)) - عنوان الصورة
  - Description (nvarchar(500))
  - SortOrder (int)
  - IsActive (bit)
  - CreatedDate

### 2.3 Search & Analytics (البحث والإحصائيات)

- **SearchLogs** - سجل البحث

  - Id (Guid, PK)
  - SearchTerm (nvarchar(200)) - مصطلح البحث
  - CategoryId (Guid, FK → BusinessCategories, nullable)
  - CityId (Guid, FK → Cities, nullable)
  - ResultCount (int) - عدد النتائج
  - UserIP (nvarchar(45)) - عنوان IP
  - AuthUserId (Guid, nullable) - المستخدم إذا مسجل
  - CreatedDate

- **BusinessViews** - مشاهدات الأعمال
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - AuthUserId (Guid, nullable)
  - UserIP (nvarchar(45))
  - ViewDate (datetime2)
  - ReferrerUrl (nvarchar(500)) - المصدر

## 3. System Tables (جداول النظام)

### 3.1 Configuration (الإعدادات)

- **SystemSettings** - إعدادات النظام
  - Id (Guid, PK)
  - Key (nvarchar(100)) - مفتاح الإعداد
  - Value (nvarchar(max)) - القيمة
  - Description (nvarchar(500))
  - Category (nvarchar(50)) - فئة الإعداد
  - IsActive (bit)
  - UpdatedDate, UpdatedBy

### 3.2 Content Management (إدارة المحتوى)

- **Pages** - الصفحات الثابتة

  - Id (Guid, PK)
  - Title (nvarchar(200))
  - Slug (nvarchar(200)) - الرابط الودود
  - Content (nvarchar(max)) - المحتوى
  - MetaTitle (nvarchar(200))
  - MetaDescription (nvarchar(500))
  - IsPublished (bit)
  - CreatedDate, UpdatedDate

- **Banners** - البنرات الإعلانية
  - Id (Guid, PK)
  - Title (nvarchar(200))
  - ImageData (varbinary(max))
  - LinkUrl (nvarchar(500))
  - Position (nvarchar(50)) - موقع البنر
  - StartDate (datetime2)
  - EndDate (datetime2)
  - IsActive (bit)
  - SortOrder (int)

## 4. User Management (إدارة المستخدمين)

### 4.1 Business Owners (أصحاب الأعمال)

- **BusinessOwners** - أصحاب الأعمال
  - Id (Guid, PK)
  - AuthUserId (Guid) - ربط مع نظام المصادقة
  - FirstName (nvarchar(100))
  - LastName (nvarchar(100))
  - Phone (nvarchar(20))
  - Email (nvarchar(100))
  - IsVerified (bit) - التحقق من الهوية
  - VerificationDocuments (varbinary(max))
  - CreatedDate, UpdatedDate

### 4.2 Subscriptions (الاشتراكات)

- **SubscriptionPlans** - خطط الاشتراك

  - Id (Guid, PK)
  - Name (nvarchar(100))
  - Description (nvarchar(500))
  - Price (decimal(10,2))
  - DurationDays (int)
  - MaxBusinesses (int) - عدد الأعمال المسموح
  - MaxImages (int) - عدد الصور المسموح
  - Features (nvarchar(max)) - المميزات JSON
  - IsActive (bit)

- **BusinessSubscriptions** - اشتراكات الأعمال
  - Id (Guid, PK)
  - BusinessId (Guid, FK → Businesses)
  - PlanId (Guid, FK → SubscriptionPlans)
  - StartDate (datetime2)
  - EndDate (datetime2)
  - IsActive (bit)
  - CreatedDate

## 5. Indexes & Performance (الفهارس والأداء)

### 5.1 Primary Indexes

```sql
-- Business search optimization
CREATE INDEX IX_Businesses_Name_IsActive ON Businesses(Name, IsActive);
CREATE INDEX IX_Businesses_Category_City ON BusinessCategoryMappings(CategoryId, BusinessId);
CREATE INDEX IX_BusinessAddresses_City_District ON BusinessAddresses(CityId, DistrictId, BusinessId);

-- Location-based search
CREATE INDEX IX_BusinessAddresses_Location ON BusinessAddresses(Latitude, Longitude);
CREATE INDEX IX_BusinessAddresses_Business_Primary ON BusinessAddresses(BusinessId, IsPrimary);

-- Performance indexes
CREATE INDEX IX_BusinessReviews_Business_Approved ON BusinessReviews(BusinessId, IsApproved);
CREATE INDEX IX_BusinessViews_Business_Date ON BusinessViews(BusinessId, ViewDate);
CREATE INDEX IX_SearchLogs_Term_Date ON SearchLogs(SearchTerm, CreatedDate);
```

### 5.2 Full-Text Search

```sql
-- Arabic text search optimization
CREATE FULLTEXT CATALOG SyriaDirectoryCatalog;
CREATE FULLTEXT INDEX ON Businesses(Name, Description) KEY INDEX PK_Businesses;
CREATE FULLTEXT INDEX ON BusinessCategories(Name, Description) KEY INDEX PK_BusinessCategories;
```

## 6. Data Migration Plan (خطة ترحيل البيانات)

### 6.1 من StorePlatform إلى SyriaDirectory

- **Products** → **Businesses**
- **Categories** → **BusinessCategories**
- **ProductReviews** → **BusinessReviews**
- **Addresses** → **BusinessAddresses**

### 6.2 Initial Data (البيانات الأولية)

- مدن سوريا الرئيسية (دمشق، حلب، حمص، إلخ)
- التصنيفات الأساسية (مطاعم، طبي، تعليم، إلخ)
- إعدادات النظام الافتراضية

## 7. Security & Backup (الأمان والنسخ الاحتياطي)

### 7.1 Security Measures

- تشفير البيانات الحساسة
- Audit logs لجميع العمليات المهمة
- Rate limiting للبحث والAPI
- Input validation وSQL injection protection

### 7.2 Backup Strategy

- نسخ احتياطية يومية للبيانات
- نسخ احتياطية أسبوعية كاملة
- Point-in-time recovery
- Disaster recovery plan
