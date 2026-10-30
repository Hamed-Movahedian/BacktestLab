import pandas as pd
import pandas_ta as ta
from backtesting import Strategy
from backtesting.lib import crossover


def get_macd(close, fast=12, slow=26, signal=9):
    s = pd.Series(close)
    macd_df = ta.macd(s, fast=fast, slow=slow, signal=signal)

    # سه ستون خروجی: MACD, Signal, Histogram
    macd_line = macd_df.iloc[:, 0].to_numpy()
    hist = macd_df.iloc[:, 1].to_numpy()
    signal_line = macd_df.iloc[:, 2].to_numpy()

    return macd_line, signal_line, hist


class MacdStrategy(Strategy):
    fast = 12
    slow = 26
    signal = 9

    def init(self):
        self.macd, self.signal, self.hist = self.I(
            get_macd, self.data.Close, self.fast, self.slow, self.signal
        )

    # def next(self):
    #     if crossover(self.macd, self.signal):
    #         self.buy()
    #     elif crossover(self.signal, self.macd):
    #         self.position.close()

    def next(self):
        if crossover(self.signal, self.macd):
            self.sell()
        elif crossover(self.macd, self.signal):
            self.position.close()
