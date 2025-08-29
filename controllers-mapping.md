# Controllers Mapping - StorePlatform إلى SyriaDirectory.PLATFORM

## Controllers القابلة للاستخدام مباشرة ✅

### 1. **CategoriesController** ✅ (نفس الاسم)

- **الاستخدام**: إدارة فئات الأعمال التجارية
- **التعديلات المطلوبة**:
  - الاحتفاظ بنفس `CategoriesDTO` مع إضافة خصائص جديدة
  - إضافة خصائص (Icon, Color, ParentCategoryId, SortOrder)
  - تغيير Entity إلى `BusinessCategory`
- **CRUD Operations**: ✅ جاهزة للاستخدام

### 2. **AddressesController** → **BusinessAddressesController**

- **الاستخدام**: إدارة عناوين الأعمال التجارية
- **التعديلات المطلوبة**:
  - إضافة خصائص (Latitude, Longitude, IsPrimary)
  - ربط مع Cities و Districts
- **CRUD Operations**: ✅ جاهزة للاستخدام

### 3. **AuthorizationEndpointsController**

- **الاستخدام**: إدارة الأذونات والصلاحيات
- **التعديلات**: ❌ بدون تعديل
- **الحاجة**: ضرورية لنظام الأذونات

## Controllers تحتاج تعديل كبير 🔄

### 4. **ProductController** → **BusinessController**

```csharp
// التحويل المطلوب
ProductViewModel → BusinessViewModel
CreateProduct → CreateBusiness
GetAllProducts → GetAllBusinesses
```

### 5. **ProductReviewsController** → **BusinessReviewsController**

```csharp
// التحويل المطلوب
ProductReviews → BusinessReviews
ProductId → BusinessId
```

## Controllers جديدة مطلوبة 🆕

### 6. **CitiesController** - جديد

```csharp
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    // GetAllCities
    // GetCitiesWithDistricts
    // CreateCity (Admin only)
    // UpdateCity (Admin only)
}
```

### 7. **DistrictsController** - جديد

```csharp
[Route("api/[controller]")]
public class DistrictsController : ControllerBase
{
    // GetDistrictsByCity
    // CreateDistrict (Admin only)
    // UpdateDistrict (Admin only)
}
```

### 8. **SearchController** - جديد

```csharp
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    // SearchBusinesses
    // GetSearchSuggestions
    // LogSearch
    // GetPopularSearchTerms
}
```

### 9. **BusinessOwnersController** - جديد

```csharp
[Route("api/[controller]")]
public class BusinessOwnersController : ControllerBase
{
    // RegisterBusinessOwner
    // VerifyBusinessOwner
    // GetOwnerBusinesses
    // UpdateOwnerProfile
}
```

## Controllers غير مطلوبة ❌

- **CartController** - غير مطلوب في الدليل
- **OrdersController** - غير مطلوب في الدليل
- **OrderItemsController** - غير مطلوب في الدليل
- **PaymentsController** - غير مطلوب حالياً
- **PromotionsController** - يمكن إضافته لاحقاً
- **QuickSaleController** - غير مطلوب في الدليل
- **ReturnsController** - غير مطلوب في الدليل
- **ShipmentsController** - غير مطلوب في الدليل
- **StockAlertsController** - غير مطلوب في الدليل
- **InventorySnapshotController** - غير مطلوب في الدليل

## Controllers يمكن تكييفها لاحقاً 🔮

### 10. **ApplicationServicesController**

- **الاستخدام المحتمل**: إدارة خدمات التطبيق العامة
- **التكييف**: يمكن استخدامه لإعدادات النظام

### 11. **DefinitionsController**

- **الاستخدام المحتمل**: إدارة التعريفات والقوائم المرجعية
- **التكييف**: يمكن استخدامه لإدارة قوائم النظام

### 12. **SendWpMessageController**

- **الاستخدام المحتمل**: إرسال رسائل واتساب للأعمال
- **التكييف**: مفيد للتواصل مع أصحاب الأعمال

## خطة التنفيذ 📋

### المرحلة الأولى - الأساسيات

1. ✅ **CategoriesController** (تعديل بسيط)
2. ✅ **AddressesController** (تعديل بسيط)
3. 🆕 **CitiesController** (جديد)
4. 🆕 **DistrictsController** (جديد)

### المرحلة الثانية - الأعمال

1. 🔄 **ProductController** → **BusinessController** (تعديل كبير)
2. 🆕 **BusinessOwnersController** (جديد)
3. 🆕 **SearchController** (جديد)

### المرحلة الثالثة - التفاعل

1. 🔄 **ProductReviewsController** → **BusinessReviewsController**
2. ✅ **AuthorizationEndpointsController** (بدون تعديل)

### المرحلة الرابعة - التحسينات

1. 🔮 **ApplicationServicesController** (تكييف)
2. 🔮 **DefinitionsController** (تكييف)
3. 🔮 **SendWpMessageController** (تكييف)

## تقدير الجهد المطلوب ⏱️

| Controller                   | نوع العمل   | الوقت المقدر | الأولوية |
| ---------------------------- | ----------- | ------------ | -------- |
| BusinessCategoriesController | تعديل بسيط  | 2-3 ساعات    | عالية    |
| BusinessAddressesController  | تعديل بسيط  | 2-3 ساعات    | عالية    |
| CitiesController             | جديد        | 4-5 ساعات    | عالية    |
| DistrictsController          | جديد        | 3-4 ساعات    | عالية    |
| BusinessController           | تعديل كبير  | 8-10 ساعات   | عالية    |
| SearchController             | جديد        | 6-8 ساعات    | متوسطة   |
| BusinessReviewsController    | تعديل متوسط | 4-6 ساعات    | متوسطة   |
| BusinessOwnersController     | جديد        | 5-7 ساعات    | متوسطة   |

## نصائح للتطوير 💡

1. **ابدأ بـ Cities و Districts** - هذه أساسية لبقية النظام
2. **استخدم Clean Architecture** - حافظ على نفس البنية الموجودة
3. **طبق CQRS Pattern** - استخدم نفس نمط Commands/Queries
4. **استخدم MediatR** - حافظ على نفس البنية للـ handlers
5. **تأكد من Validation** - استخدم FluentValidation
6. **طبق Authorization** - استخدم نفس نظام الأذونات الموجود
