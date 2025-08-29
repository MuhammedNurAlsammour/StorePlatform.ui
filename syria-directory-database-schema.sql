-- ================================================
-- Syria Directory Platform - Database Schema
-- إن شاء الله - بإذن الله
-- ================================================

USE master;
GO

-- Database oluşturma / إنشاء قاعدة البيانات
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SyriaDirectoryPlatform')
BEGIN
    CREATE DATABASE SyriaDirectoryPlatform
    COLLATE Arabic_CI_AS;
END
GO

USE SyriaDirectoryPlatform;
GO

-- ================================================
-- 1. CORE TABLES / الجداول الأساسية
-- ================================================

-- Cities Table / جدول المدن
CREATE TABLE Cities (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NULL,
    Code NVARCHAR(10) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL
);

-- Districts Table / جدول الأحياء
CREATE TABLE Districts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NULL,
    CityId UNIQUEIDENTIFIER NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_Districts_Cities FOREIGN KEY (CityId) REFERENCES Cities(Id)
);

-- Business Categories Table / جدول فئات الأعمال
CREATE TABLE BusinessCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    Icon NVARCHAR(50) NULL, -- FontAwesome icon class
    Color NVARCHAR(7) NULL, -- Hex color code
    ParentCategoryId UNIQUEIDENTIFIER NULL,
    SortOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    DeletedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_BusinessCategories_Parent FOREIGN KEY (ParentCategoryId) REFERENCES BusinessCategories(Id)
);

-- Businesses Table / جدول الأعمال التجارية
CREATE TABLE Businesses (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(100) NULL,
    Website NVARCHAR(200) NULL,
    WorkingHours NVARCHAR(500) NULL, -- JSON format for working hours
    IsActive BIT NOT NULL DEFAULT 1,
    IsVerified BIT NOT NULL DEFAULT 0,
    IsFeatured BIT NOT NULL DEFAULT 0,
    Rating DECIMAL(3,2) NULL DEFAULT 0, -- Average rating 0.00 to 5.00
    ReviewCount INT NOT NULL DEFAULT 0,
    ViewCount INT NOT NULL DEFAULT 0,
    Logo VARBINARY(MAX) NULL,
    CoverImage VARBINARY(MAX) NULL,
    LogoContentType NVARCHAR(50) NULL,
    CoverImageContentType NVARCHAR(50) NULL,
    AuthUserId UNIQUEIDENTIFIER NOT NULL, -- Owner ID from auth system
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    DeletedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    DeletedBy UNIQUEIDENTIFIER NULL
);

-- Business Addresses Table / جدول عناوين الأعمال
CREATE TABLE BusinessAddresses (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BusinessId UNIQUEIDENTIFIER NOT NULL,
    CityId UNIQUEIDENTIFIER NOT NULL,
    DistrictId UNIQUEIDENTIFIER NULL,
    Street NVARCHAR(200) NULL,
    BuildingNumber NVARCHAR(20) NULL,
    PostalCode NVARCHAR(20) NULL,
    Latitude DECIMAL(10,8) NULL, -- For mapping
    Longitude DECIMAL(11,8) NULL, -- For mapping
    IsPrimary BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_BusinessAddresses_Businesses FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE,
    CONSTRAINT FK_BusinessAddresses_Cities FOREIGN KEY (CityId) REFERENCES Cities(Id),
    CONSTRAINT FK_BusinessAddresses_Districts FOREIGN KEY (DistrictId) REFERENCES Districts(Id)
);

-- Business Category Mappings / ربط الأعمال بالفئات
CREATE TABLE BusinessCategoryMappings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BusinessId UNIQUEIDENTIFIER NOT NULL,
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    IsPrimary BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_BusinessCategories_Business FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE,
    CONSTRAINT FK_BusinessCategories_Category FOREIGN KEY (CategoryId) REFERENCES BusinessCategories(Id),
    CONSTRAINT UK_BusinessCategory_Mapping UNIQUE (BusinessId, CategoryId)
);

-- ================================================
-- 2. EXTENDED FEATURES / الميزات الإضافية
-- ================================================

-- Business Reviews Table / جدول تقييمات الأعمال
CREATE TABLE BusinessReviews (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BusinessId UNIQUEIDENTIFIER NOT NULL,
    AuthUserId UNIQUEIDENTIFIER NOT NULL, -- Reviewer ID
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Title NVARCHAR(200) NULL,
    Comment NVARCHAR(1000) NULL,
    IsApproved BIT NOT NULL DEFAULT 0,
    IsReported BIT NOT NULL DEFAULT 0,
    ReportReason NVARCHAR(500) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    ApprovedDate DATETIME2 NULL,
    ApprovedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_BusinessReviews_Business FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE
);

-- Business Images Table / جدول صور الأعمال
CREATE TABLE BusinessImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BusinessId UNIQUEIDENTIFIER NOT NULL,
    ImageData VARBINARY(MAX) NOT NULL,
    ImageType NVARCHAR(20) NOT NULL, -- 'gallery', 'menu', 'interior', etc.
    ContentType NVARCHAR(50) NOT NULL,
    Title NVARCHAR(200) NULL,
    Description NVARCHAR(500) NULL,
    SortOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_BusinessImages_Business FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE
);

-- ================================================
-- 3. ANALYTICS & SEARCH / التحليلات والبحث
-- ================================================

-- Search Logs Table / سجل البحث
CREATE TABLE SearchLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SearchTerm NVARCHAR(200) NOT NULL,
    CategoryId UNIQUEIDENTIFIER NULL,
    CityId UNIQUEIDENTIFIER NULL,
    DistrictId UNIQUEIDENTIFIER NULL,
    ResultCount INT NOT NULL DEFAULT 0,
    UserIP NVARCHAR(45) NULL,
    AuthUserId UNIQUEIDENTIFIER NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_SearchLogs_Category FOREIGN KEY (CategoryId) REFERENCES BusinessCategories(Id),
    CONSTRAINT FK_SearchLogs_City FOREIGN KEY (CityId) REFERENCES Cities(Id),
    CONSTRAINT FK_SearchLogs_District FOREIGN KEY (DistrictId) REFERENCES Districts(Id)
);

-- Business Views Table / مشاهدات الأعمال
CREATE TABLE BusinessViews (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BusinessId UNIQUEIDENTIFIER NOT NULL,
    AuthUserId UNIQUEIDENTIFIER NULL,
    UserIP NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    ReferrerUrl NVARCHAR(500) NULL,
    ViewDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_BusinessViews_Business FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE
);

-- ================================================
-- 4. SYSTEM TABLES / جداول النظام
-- ================================================

-- System Settings Table / إعدادات النظام
CREATE TABLE SystemSettings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Key] NVARCHAR(100) NOT NULL UNIQUE,
    [Value] NVARCHAR(MAX) NULL,
    Description NVARCHAR(500) NULL,
    Category NVARCHAR(50) NULL,
    DataType NVARCHAR(20) NOT NULL DEFAULT 'string', -- string, int, bool, json
    IsActive BIT NOT NULL DEFAULT 1,
    UpdatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedBy UNIQUEIDENTIFIER NULL
);

-- Content Pages Table / الصفحات الثابتة
CREATE TABLE Pages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    Slug NVARCHAR(200) NOT NULL UNIQUE,
    Content NVARCHAR(MAX) NULL,
    MetaTitle NVARCHAR(200) NULL,
    MetaDescription NVARCHAR(500) NULL,
    IsPublished BIT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    PublishedDate DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL
);

-- Banners Table / البنرات الإعلانية
CREATE TABLE Banners (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    ImageData VARBINARY(MAX) NULL,
    ImageContentType NVARCHAR(50) NULL,
    LinkUrl NVARCHAR(500) NULL,
    Position NVARCHAR(50) NOT NULL, -- 'header', 'sidebar', 'footer', etc.
    StartDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    EndDate DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    SortOrder INT NOT NULL DEFAULT 0,
    ClickCount INT NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL
);

-- ================================================
-- 5. BUSINESS MANAGEMENT / إدارة الأعمال
-- ================================================

-- Business Owners Table / أصحاب الأعمال
CREATE TABLE BusinessOwners (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AuthUserId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    IsVerified BIT NOT NULL DEFAULT 0,
    VerificationDocuments VARBINARY(MAX) NULL,
    VerificationStatus NVARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    VerificationNotes NVARCHAR(500) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    VerifiedDate DATETIME2 NULL,
    VerifiedBy UNIQUEIDENTIFIER NULL
);

-- ================================================
-- 6. INDEXES FOR PERFORMANCE / الفهارس للأداء
-- ================================================

-- Business search optimization
CREATE INDEX IX_Businesses_Name_IsActive ON Businesses(Name, IsActive);
CREATE INDEX IX_Businesses_IsActive_IsVerified ON Businesses(IsActive, IsVerified);
CREATE INDEX IX_Businesses_AuthUserId ON Businesses(AuthUserId);
CREATE INDEX IX_Businesses_Rating_ViewCount ON Businesses(Rating DESC, ViewCount DESC);

-- Category and location indexes
CREATE INDEX IX_BusinessCategoryMappings_Category_Business ON BusinessCategoryMappings(CategoryId, BusinessId);
CREATE INDEX IX_BusinessCategoryMappings_Business_Primary ON BusinessCategoryMappings(BusinessId, IsPrimary);
CREATE INDEX IX_BusinessAddresses_City_District ON BusinessAddresses(CityId, DistrictId, BusinessId);
CREATE INDEX IX_BusinessAddresses_Business_Primary ON BusinessAddresses(BusinessId, IsPrimary);

-- Location-based search (spatial index would be better for production)
CREATE INDEX IX_BusinessAddresses_Location ON BusinessAddresses(Latitude, Longitude) WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL;

-- Review and analytics indexes
CREATE INDEX IX_BusinessReviews_Business_Approved ON BusinessReviews(BusinessId, IsApproved);
CREATE INDEX IX_BusinessReviews_AuthUserId ON BusinessReviews(AuthUserId);
CREATE INDEX IX_BusinessViews_Business_Date ON BusinessViews(BusinessId, ViewDate DESC);
CREATE INDEX IX_SearchLogs_Term_Date ON SearchLogs(SearchTerm, CreatedDate DESC);

-- Category hierarchy
CREATE INDEX IX_BusinessCategories_Parent_Sort ON BusinessCategories(ParentCategoryId, SortOrder);

-- ================================================
-- 7. TRIGGERS / المشغلات
-- ================================================

-- Update business rating when review is added/updated
CREATE TRIGGER TR_BusinessReviews_UpdateRating
ON BusinessReviews
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Update for inserted/updated records
    IF EXISTS(SELECT 1 FROM inserted)
    BEGIN
        UPDATE b
        SET Rating = (
            SELECT AVG(CAST(r.Rating AS DECIMAL(3,2)))
            FROM BusinessReviews r
            WHERE r.BusinessId = b.Id AND r.IsApproved = 1
        ),
        ReviewCount = (
            SELECT COUNT(*)
            FROM BusinessReviews r
            WHERE r.BusinessId = b.Id AND r.IsApproved = 1
        )
        FROM Businesses b
        INNER JOIN inserted i ON b.Id = i.BusinessId;
    END

    -- Update for deleted records
    IF EXISTS(SELECT 1 FROM deleted) AND NOT EXISTS(SELECT 1 FROM inserted)
    BEGIN
        UPDATE b
        SET Rating = (
            SELECT AVG(CAST(r.Rating AS DECIMAL(3,2)))
            FROM BusinessReviews r
            WHERE r.BusinessId = b.Id AND r.IsApproved = 1
        ),
        ReviewCount = (
            SELECT COUNT(*)
            FROM BusinessReviews r
            WHERE r.BusinessId = b.Id AND r.IsApproved = 1
        )
        FROM Businesses b
        INNER JOIN deleted d ON b.Id = d.BusinessId;
    END
END;
GO

-- Update business view count
CREATE TRIGGER TR_BusinessViews_UpdateCount
ON BusinessViews
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE b
    SET ViewCount = ViewCount + 1
    FROM Businesses b
    INNER JOIN inserted i ON b.Id = i.BusinessId;
END;
GO

-- ================================================
-- 8. INITIAL DATA / البيانات الأولية
-- ================================================

-- Insert Syrian Cities / إدراج المدن السورية
INSERT INTO Cities (Name, NameEn, Code) VALUES
(N'دمشق', 'Damascus', 'DM'),
(N'حلب', 'Aleppo', 'AL'),
(N'حمص', 'Homs', 'HO'),
(N'حماة', 'Hama', 'HA'),
(N'اللاذقية', 'Latakia', 'LA'),
(N'طرطوس', 'Tartus', 'TA'),
(N'دير الزور', 'Deir ez-Zor', 'DZ'),
(N'الرقة', 'Raqqa', 'RA'),
(N'درعا', 'Daraa', 'DA'),
(N'السويداء', 'As-Suwayda', 'SW'),
(N'القنيطرة', 'Quneitra', 'QU'),
(N'الحسكة', 'Al-Hasakah', 'HS'),
(N'إدلب', 'Idlib', 'ID'),
(N'ريف دمشق', 'Rif Dimashq', 'RD');

-- Insert Business Categories / إدراج فئات الأعمال
INSERT INTO BusinessCategories (Name, Description, Icon, Color, SortOrder) VALUES
(N'مطاعم ومقاهي', N'المطاعم والمقاهي والمشروبات', 'fas fa-utensils', '#FF6B6B', 1),
(N'تسوق وتجارة', N'المتاجر والأسواق التجارية', 'fas fa-shopping-bag', '#4ECDC4', 2),
(N'طبية وصحية', N'المستشفيات والعيادات والصيدليات', 'fas fa-stethoscope', '#45B7D1', 3),
(N'تعليم وتدريب', N'المدارس والجامعات ومراكز التدريب', 'fas fa-graduation-cap', '#96CEB4', 4),
(N'سيارات ونقل', N'خدمات السيارات والنقل', 'fas fa-car', '#FFEAA7', 5),
(N'عقارات وإنشاء', N'العقارات والبناء والمقاولات', 'fas fa-home', '#DDA0DD', 6),
(N'تقنية ومعلومات', N'خدمات الكمبيوتر والإنترنت', 'fas fa-laptop', '#98D8C8', 7),
(N'جمال وعناية', N'صالونات التجميل والعناية الشخصية', 'fas fa-heart', '#F7DC6F', 8),
(N'خدمات منزلية', N'خدمات التنظيف والصيانة المنزلية', 'fas fa-tools', '#BB8FCE', 9),
(N'رياضة وترفيه', N'النوادي الرياضية وأماكن الترفيه', 'fas fa-dumbbell', '#85C1E9', 10);

-- Insert System Settings / إدراج إعدادات النظام
INSERT INTO SystemSettings ([Key], [Value], Description, Category, DataType) VALUES
('site.title', N'دليل سوريا', N'عنوان الموقع', 'general', 'string'),
('site.description', N'دليلك الشامل للأعمال والخدمات في سوريا', N'وصف الموقع', 'general', 'string'),
('site.keywords', N'دليل سوريا, أعمال, خدمات, مطاعم, شركات', N'كلمات مفتاحية للموقع', 'seo', 'string'),
('search.maxResults', '50', N'أقصى عدد نتائج البحث', 'search', 'int'),
('reviews.requireApproval', 'true', N'تتطلب التقييمات موافقة قبل النشر', 'reviews', 'bool'),
('business.maxImages', '10', N'أقصى عدد صور لكل عمل تجاري', 'business', 'int'),
('maps.defaultZoom', '12', N'مستوى التكبير الافتراضي للخرائط', 'maps', 'int');

-- Insert sample districts for Damascus / أحياء دمشق النموذجية
DECLARE @DamascusId UNIQUEIDENTIFIER = (SELECT Id FROM Cities WHERE Code = 'DM');
INSERT INTO Districts (Name, NameEn, CityId) VALUES
(N'الشيخ محي الدين', 'Sheikh Mohiuddin', @DamascusId),
(N'أبو رمانة', 'Abu Rummaneh', @DamascusId),
(N'المالكي', 'Malki', @DamascusId),
(N'الميدان', 'Midan', @DamascusId),
(N'الصالحية', 'Salihiyah', @DamascusId),
(N'القصاع', 'Qassaa', @DamascusId),
(N'المزة', 'Mezzeh', @DamascusId),
(N'كفر سوسة', 'Kafr Sousa', @DamascusId),
(N'دمر', 'Douma', @DamascusId),
(N'جرمانا', 'Jaramana', @DamascusId);

GO

PRINT N'إن شاء الله - تم إنشاء قاعدة بيانات دليل سوريا بنجاح';
PRINT N'Syria Directory Platform database created successfully';
