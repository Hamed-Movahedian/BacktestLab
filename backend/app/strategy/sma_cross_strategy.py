from backtesting import Strategy
from backtesting.lib import crossover
from backtesting.test import SMA


# ۲. تعریف استراتژی (مثال: تقاطع دو میانگین متحرک)
class SmaCross(Strategy):
    n1 = 10  # پریود میانگین سریع
    n2 = 20  # پریود میانگین کند

    def init(self):
        # محاسبه اندیکاتورها برای نمایش روی نمودار
        self.sma1 = self.I(SMA, self.data.Close, self.n1)
        self.sma2 = self.I(SMA, self.data.Close, self.n2)

    def next(self):
        # اگر میانگین سریع، میانگین کند را به سمت بالا قطع کرد -> خرید
        if crossover(self.sma1, self.sma2):
            self.buy()
        # اگر میانگین سریع، میانگین کند را به سمت پایین قطع کرد -> بستن معامله
        elif crossover(self.sma2, self.sma1) and self.position.is_long:
            self.position.close()
