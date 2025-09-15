import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from '@coder-pioneers/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  template: `
    <lib-login
      [images]="sliderImages"
      [companyImage]="companyImage"
      [modulImage]="modulImage"
      [modulVersion]="modulVersion"
      [controllerEmployeeById]="DEFAULT_CONTROLLER"
      [actionEmployeeById]="DEFAULT_ACTION"
      [userIdParamEmployeeById]="DEFAULT_USER_ID_PARAM"
      [afterLoginPageRoute]="afterLoginPageRoute"
      [userIdParamOrpath]="userIdParamOrpath"
    ></lib-login>
  `,
})
export class LoginsComponent extends LoginComponent<any> {
  title = 'test-app';

  // #region şirket resmi
  override companyImage = 'assets/login/sylogo.png';
  // #endregion

  // #region modul resmi
  override modulImage = 'assets/login/Logo4.png';
  // #endregion

  // #region modul versiyonu
  override modulVersion: string = '1.0.2';
  // #endregion

  // #region modul versiyonu
  override userIdParamOrpath: boolean = false;
  // #endregion

  // #region controller ve action parametreleri
  // DEFAULT_CONTROLLER = 'PersonnelList';
  // DEFAULT_ACTION = 'GetPersonnelUserIdList';
  DEFAULT_CONTROLLER = 'Employee';
  DEFAULT_ACTION = 'GetEmployeeByUserId';
  DEFAULT_USER_ID_PARAM = 'userId';
  // #endregion

  // #region login işlemi sonrası sayfa
  override afterLoginPageRoute: string = '/settings';
  // #endregion

  // #region sidbar resimleri ve yazılar
  sliderImages = [
    {
      path: 'assets/login/bir.png',
      title: 'Takip Et,',
      subtitle: 'Başarıya Birlikte Koş!',
      description:
        'Etkili görev takibi, başarılı proje yönetiminin temelidir. Modern iş dünyasında, her görevin zamanında ve doğru şekilde tamamlanması kritik önem taşır. Bizim görev takip sistemimiz, ekiplerinizin verimliliğini artırırken, iş süreçlerinizi şeffaf ve ölçülebilir hale getirir.',
    },
    {
      path: 'assets/login/iki.png',
      title: 'Sistemin Gücü,',
      subtitle: 'Başarıya Birlikte Koş!',
      description:
        'Görev takip platformumuz, kullanıcı dostu arayüzü, gerçek zamanlı bildirim sistemi ve kapsamlı raporlama özellikleriyle öne çıkar. Her ekip üyesi, kendisine atanan görevleri kolayca takip edebilir, ilerlemelerini paylaşabilir ve iş arkadaşlarıyla etkili bir şekilde iletişim kurabilir. Bu sayede, ekip çalışması ve proje koordinasyonu yeni bir boyut kazanır.',
    },
    {
      path: 'assets/login/uc.png',
      title: 'Geleceğin İş Yönetimi,',
      subtitle: 'Başarıya Birlikte Koş!',
      description:
        'İş dünyası sürekli değişiyor ve biz bu değişime ayak uyduracak çözümler sunuyoruz. Ekiplerinizin potansiyelini maksimuma çıkarın, verimliliği artırın ve rekabet avantajı elde edin. Geleceğin iş yönetimi için bizimle adım atın.',
    },
  ];
  // #endregion
}
