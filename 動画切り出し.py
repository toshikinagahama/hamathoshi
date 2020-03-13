#!/usr/bin/env python
# coding: utf-8
# In[1]:
from subprocess import Popen, PIPE
import pandas as pd
import numpy as np
from tqdm import tqdm
import os

# # 自作関数
# In[2]:
def run_program(command):
    """
    外部プログラムを実行する
    """
    p = Popen(command, stdout=PIPE)

    while 1:
        c = p.stdout.readline()
        if not c:
            break
        print(c.decode("Shift_JIS"), end="")
    p.wait()


# In[3]:
def cutout_movie(inputFilename, outputFilename, startTime, endTime):
    """
    ffmpegを用いて映像をカットする
    """
    t = int(endTime - startTime)
    # option = "-c:v copy -c:a copy -async 1 -strict -2"
    option = "-vcodec copy -acodec copy"
    # command = "ffmpeg -ss {0} -i {1} -ss 0 -t {2} {3} {4} -y".format(startTime, inputFilename, t, option, outputFilename)
    command = "ffmpeg -ss {0} -i {1} -t {2} {3} {4} -y".format(
        startTime, inputFilename, t, option, outputFilename
    )
    print(command)
    run_program(command)

os.chdir(os.path.dirname(os.path.abspath(__file__)))
# In[4]:
df_batting = pd.read_csv(u"各打者各打席録画時間.csv", encoding="Shift_JIS")
# In[5]:
index = 0
# In[6]:
players = df_batting[u"名前"].unique()
# In[7]:
strStartTime = u"開始時間[秒]"
strEndTime = u"終了時間[秒]"
sOutputFolderName = "各打席"
inputFilename = u"試合.MP4"
os.makedirs(sOutputFolderName, exist_ok=True)

for player in players:
    os.makedirs("{0}/{1}".format(sOutputFolderName, player), exist_ok=True)
    tdf = df_batting[df_batting[u"名前"] == player]
    for i in tqdm(range(1, 7)):  # 最大7打席まで
        sBatting = u"{0}打席".format(i)
        sStart = u"{0}{1}".format(sBatting, strStartTime)
        sEnd = u"{0}{1}".format(sBatting, strEndTime)

        startTime = tdf[sStart].values[index]  # 開始時間
        endTime = tdf[sEnd].values[index]  # 終了時間
        print(startTime)
        print(endTime)
        if np.isnan(startTime) | np.isnan(endTime):
            continue

        print(u"{0}\t{1}\t\t{2}\t{3}".format(sStart, startTime, sEnd, endTime))

        outputFilename = u"{0}/{1}/{2}.mp4".format(sOutputFolderName, player, sBatting)
        cutout_movie(inputFilename, outputFilename, startTime, endTime)
    # break

