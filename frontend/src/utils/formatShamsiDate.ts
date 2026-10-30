import moment from 'moment-jalaali';
// import 'moment/locale/fa'; // ۱. ایمپورت لوکال فارسی
//require('moment/locale/fa'); 
// ۲. تنظیم پیش‌فرض‌ها برای زبان فارسی و اعداد انگلیسی/فارسی
moment.locale('fa');
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

/**
 * تبدیل تاریخ شمسی به فرمت فارسی
 * @param shamsiDate - مثال: "1405-06-26"
 * @returns "سه شنبه 26 شهریور 1405"
 */
export function formatShamsiDate(shamsiDate: string): string {
  const m = moment(shamsiDate, 'jYYYY-jMM-jDD');

  if (!m.isValid()) {
    return 'تاریخ نامعتبر';
  }

  // dddd: نام روز هفته (سه شنبه)
  // jD: روز ماه (26)
  // jMMMM: نام ماه جلالی (شهریور)
  // jYYYY: سال جلالی (1405)
  return m.format('dddd jD jMMMM jYYYY');
}

