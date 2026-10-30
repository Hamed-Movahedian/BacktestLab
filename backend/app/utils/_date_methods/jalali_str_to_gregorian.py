from datetime import date

import jdatetime


def jalali_str_to_gregorian(date_str: str) -> date:
    """
    تبدیل تاریخ شمسی با فرمت YYYY-MM-DD به datetime.date میلادی
    مثال ورودی: "1402-12-25"
    """
    # جداسازی سال، ماه و روز
    year, month, day = map(int, date_str.split('-'))
    
    # ساخت شیء شمسی و تبدیل به میلادی
    return jdatetime.date(year, month, day).togregorian()


def gregorian_date_to_jalali_str(g_date: date) -> str:
    """
    تبدیل datetime.date میلادی به رشته تاریخ شمسی با فرمت YYYY-MM-DD
    مثال ورودی: date(2024, 3, 15)
    مثال خروجی: "1402-12-25"
    """
    j_date = jdatetime.date.fromgregorian(date=g_date)
    return f"{j_date.year:04d}-{j_date.month:02d}-{j_date.day:02d}"

