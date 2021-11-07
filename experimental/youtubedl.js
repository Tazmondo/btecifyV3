const ytdl = require('youtube-dl-exec');

// 6
let test1 = ["http://www.youtube.com/watch?v=sbTVZMJ9Z2I", "http://www.youtube.com/watch?v=0EWrOY2okdA", "http://www.youtube.com/watch?v=CD7aZ9MTuew", "https://www.youtube.com/watch?v=q9tcHoD6r0c", "https://www.youtube.com/watch?v=ibUOxEBxVsE", "http://www.youtube.com/watch?v=Z0vfSmGpJ6Y"]

// 21
let test3 = ["http://www.youtube.com/watch?v=qU9mHegkTc4", "http://www.youtube.com/watch?v=80oOFk5tYps", "http://www.youtube.com/watch?v=bpOSxM0rNPM", "http://www.youtube.com/watch?v=GeyA2L5LNBk", "http://www.youtube.com/watch?v=0w6WlfdPSms", "http://www.youtube.com/watch?v=od2q-e5K-Zc", "http://www.youtube.com/watch?v=KyNVRrHkwe0", "http://www.youtube.com/watch?v=8GW6sLrK40k", "http://www.youtube.com/watch?v=wU0UbTDxABI", "http://www.youtube.com/watch?v=lyO-Sveg6a8", "https://www.youtube.com/watch?v=k4Xx0k_TVY0", "http://www.youtube.com/watch?v=fAR1Wbw9ZmE", "http://www.youtube.com/watch?v=mGUjVbsYG6E", "http://www.youtube.com/watch?v=NgLWF2XJyKA", "http://www.youtube.com/watch?v=C4qJ4y-rDgs", "http://www.youtube.com/watch?v=giLpYG11qxQ", "https://www.youtube.com/watch?v=32gdelvYax0", "http://www.youtube.com/watch?v=yfrEMQgBc2Y", "http://www.youtube.com/watch?v=VredAgNScOw", "http://www.youtube.com/watch?v=anw6Gyh_ahU", "http://www.youtube.com/watch?v=VsxlqmSDmBU"]

// 89
let test4 = ["https://www.youtube.com/watch?v=yL0Q-MSZ3Ao", "https://youtu.be/S7Q7lpA5I9E", "http://www.youtube.com/watch?v=qU9mHegkTc4", "http://www.youtube.com/watch?v=1rwAvUvvQzQ", "http://www.youtube.com/watch?v=WgibpyTp6dY", "http://www.youtube.com/watch?v=ftGlUnWZhrA", "http://www.youtube.com/watch?v=TqDT0FIoiPs", "http://www.youtube.com/watch?v=aiOqsckDH7g", "http://www.youtube.com/watch?v=oclKw3jAWRU", "http://www.youtube.com/watch?v=wkcI2snrYtQ", "http://www.youtube.com/watch?v=V_IgNw668yo", "http://www.youtube.com/watch?v=3WZb20NinCs", "http://www.youtube.com/watch?v=pvXUPQDvpd4", "http://www.youtube.com/watch?v=m3EHCTP3jic", "http://www.youtube.com/watch?v=_xHW4wBKOYY", "http://www.youtube.com/watch?v=46F7fRxqN7k", "http://www.youtube.com/watch?v=oBE2BnLIQwQ", "https://www.youtube.com/watch?v=qIk6YFTzckc", "http://www.youtube.com/watch?v=-oRvqt8QMkc", "http://www.youtube.com/watch?v=7Hs1P2eSv0o", "http://www.youtube.com/watch?v=CD7aZ9MTuew", "http://www.youtube.com/watch?v=EdCvpbr9XWM", "http://www.youtube.com/watch?v=gN3frDIyKt0", "http://www.youtube.com/watch?v=g1e1EFqVIj4", "http://www.youtube.com/watch?v=WxYno-Pc2YI", "http://www.youtube.com/watch?v=8GW6sLrK40k", "http://www.youtube.com/watch?v=zR6fECxF44I", "http://www.youtube.com/watch?v=e5Ij0a4gkOQ", "http://www.youtube.com/watch?v=v8_TwwUh3Pc", "https://www.youtube.com/watch?v=yrVsyTXHbpU", "https://www.youtube.com/watch?v=k4Xx0k_TVY0", "http://www.youtube.com/watch?v=0gjF0T6xmo8", "http://www.youtube.com/watch?v=J3KU26GMq_A", "http://www.youtube.com/watch?v=v1wMBrkUEFE", "http://www.youtube.com/watch?v=RnQofA9CNww", "http://www.youtube.com/watch?v=ntX9LYIc5Ak", "http://www.youtube.com/watch?v=4PkyrisXJvE", "https://www.youtube.com/watch?v=uUw3RexEEDQ", "http://www.youtube.com/watch?v=32GWbQt_Zn4", "http://www.youtube.com/watch?v=xvpONIFbNKM", "http://www.youtube.com/watch?v=SSeYQMRiElg", "http://www.youtube.com/watch?v=IhPlLjvxRe8", "http://www.youtube.com/watch?v=kp_51mkPEgg", "http://www.youtube.com/watch?v=8W4bT3nQkJ8", "http://www.youtube.com/watch?v=Dwa-81884m8", "http://www.youtube.com/watch?v=yvN0eSXCk74", "http://www.youtube.com/watch?v=5HJCYgDnfGY", "http://www.youtube.com/watch?v=FMNAcMNedOc", "http://www.youtube.com/watch?v=GwVvvFkjM-8", "http://www.youtube.com/watch?v=ABQdXTtDV-A", "http://www.youtube.com/watch?v=ibF_h7eDAl0", "http://www.youtube.com/watch?v=QbVQGE_evC0", "http://www.youtube.com/watch?v=mICwGit1wIU", "http://www.youtube.com/watch?v=rT0o_pmJ_Bo", "http://www.youtube.com/watch?v=PWmAxDSJ3qA", "https://www.youtube.com/watch?v=q9tcHoD6r0c", "http://www.youtube.com/watch?v=Fb-NpzzGp5U", "http://www.youtube.com/watch?v=dBvlnyvgOnw", "http://www.youtube.com/watch?v=p_9nfo8ZI0o", "http://www.youtube.com/watch?v=kglaRv-QhNw", "http://www.youtube.com/watch?v=4xAGl8-qyPA", "http://www.youtube.com/watch?v=zHG27ZPiXfw", "http://www.youtube.com/watch?v=tHxfbJG8_BM", "http://www.youtube.com/watch?v=-kNx6sqReFk", "https://www.youtube.com/watch?v=25T_6TWt2Ac", "https://www.youtube.com/watch?v=kt6z3E3Cu5Y", "https://www.youtube.com/watch?v=-Jj4s9I-53g", "https://youtu.be/MJ3plKEJZ6c", "http://www.youtube.com/watch?v=CHlE5zvy0Sg", "https://www.youtube.com/watch?v=a3wGYbq6_Mc", "http://www.youtube.com/watch?v=xvWBd4s_6zE", "http://www.youtube.com/watch?v=V5OhmOOp9-M", "http://www.youtube.com/watch?v=qLrnkK2YEcE", "http://www.youtube.com/watch?v=cxFFhUvlRiM", "http://www.youtube.com/watch?v=E-4Nk466iIo", "http://www.youtube.com/watch?v=yxZM2CULRNE", "http://www.youtube.com/watch?v=2dYXTbIGNK8", "http://www.youtube.com/watch?v=zPGf4liO-KQ", "http://www.youtube.com/watch?v=12i5cCesvjQ", "http://www.youtube.com/watch?v=zjAYEw3hc0Y", "https://www.youtube.com/watch?v=jG47HeWmrN0", "http://www.youtube.com/watch?v=SeAAi7jWOl8", "http://www.youtube.com/watch?v=O6yQ9pJzlk8", "http://www.youtube.com/watch?v=ggHN5ZJ8jkU", "http://www.youtube.com/watch?v=XRr5GMdZsZM", "http://www.youtube.com/watch?v=Ne1VHRTaX7c", "http://www.youtube.com/watch?v=KotSHHpJd2Q", "http://www.youtube.com/watch?v=s0-DPX_RF4s", "http://www.youtube.com/watch?v=CdrLzooJVUc"]

// 255
let test5 = ["http://www.youtube.com/watch?v=aukaEzR2D1U","http://www.youtube.com/watch?v=OPWrPmsu9VU","https://www.youtube.com/watch?v=yL0Q-MSZ3Ao","http://www.youtube.com/watch?v=xsoNdPd4gBA","http://www.youtube.com/watch?v=fuZ5vWSsM5w","http://www.youtube.com/watch?v=1liTiscT6DE","http://www.youtube.com/watch?v=OgkHPLdmi-s","http://www.youtube.com/watch?v=hzl8fF1yiRw","https://youtu.be/S7Q7lpA5I9E","http://www.youtube.com/watch?v=d1hKWzn_O90","http://www.youtube.com/watch?v=1rwAvUvvQzQ","http://www.youtube.com/watch?v=WgibpyTp6dY","http://www.youtube.com/watch?v=uwEeFXgXgdE","http://www.youtube.com/watch?v=Pbpjh8_QI3U","http://www.youtube.com/watch?v=MGmDcErPrGA","http://www.youtube.com/watch?v=zr0kiRdU0M8","http://www.youtube.com/watch?v=-ZVZgCrHy5E","http://www.youtube.com/watch?v=8DCEgdYJpWQ","http://www.youtube.com/watch?v=kcSfTpMuJkM","http://www.youtube.com/watch?v=n0TjMK03jI4","http://www.youtube.com/watch?v=ftGlUnWZhrA","http://www.youtube.com/watch?v=9ExdtJJs11E","http://www.youtube.com/watch?v=JKt172e8Owc","http://www.youtube.com/watch?v=DdXHTVUalRU","http://www.youtube.com/watch?v=TqDT0FIoiPs","http://www.youtube.com/watch?v=Gb5DwwCNJh4","http://www.youtube.com/watch?v=rbIGUF9QmXg","http://www.youtube.com/watch?v=x6iSvImEGQc","http://www.youtube.com/watch?v=Mj6jF7I2s10","http://www.youtube.com/watch?v=5QyBGvZ0pHM","http://www.youtube.com/watch?v=zMK3lf-WlRk","http://www.youtube.com/watch?v=ysPtBjY8o_A","http://www.youtube.com/watch?v=7zmAdY1raTk","http://www.youtube.com/watch?v=oclKw3jAWRU","http://www.youtube.com/watch?v=6JsrVNabRME","http://www.youtube.com/watch?v=wkcI2snrYtQ","http://www.youtube.com/watch?v=V_IgNw668yo","http://www.youtube.com/watch?v=bIyl9bCp6W4","http://www.youtube.com/watch?v=72kVav_qbgQ","http://www.youtube.com/watch?v=Wsgjbsh5ZUs","http://www.youtube.com/watch?v=62RvnXZgHwQ","http://www.youtube.com/watch?v=AjGkbFqi67c","http://www.youtube.com/watch?v=9wiEM0s4aCQ","http://www.youtube.com/watch?v=3WZb20NinCs","http://www.youtube.com/watch?v=pvXUPQDvpd4","http://www.youtube.com/watch?v=6i23f-bcHIA","http://www.youtube.com/watch?v=tVIBRDNBgm8","http://www.youtube.com/watch?v=CLT99kVVF2k","http://www.youtube.com/watch?v=GdtKNNpYTtc","http://www.youtube.com/watch?v=_xHW4wBKOYY","http://www.youtube.com/watch?v=tnqBQvpBJwo","http://www.youtube.com/watch?v=MnNqnpZ5bHQ","http://www.youtube.com/watch?v=tmyuTyHAgGc","http://www.youtube.com/watch?v=46F7fRxqN7k","http://www.youtube.com/watch?v=oBE2BnLIQwQ","http://www.youtube.com/watch?v=LVpfjermoQI","https://www.youtube.com/watch?v=qIk6YFTzckc","http://www.youtube.com/watch?v=-oRvqt8QMkc","http://www.youtube.com/watch?v=xehPuqqT4G0","http://www.youtube.com/watch?v=5ItY1qJpCfg","http://www.youtube.com/watch?v=i0DMkY-YDsw","http://www.youtube.com/watch?v=H4SC6nP99qA","http://www.youtube.com/watch?v=7Hs1P2eSv0o","http://www.youtube.com/watch?v=Ui8I7JsrygA","http://www.youtube.com/watch?v=oDb_lh6ti1A","http://www.youtube.com/watch?v=SsNW9NjE4Tk","http://www.youtube.com/watch?v=NyfKgLDNnUU","http://www.youtube.com/watch?v=vr9SR6hmTPw","http://www.youtube.com/watch?v=3OC2aPCuzjo","http://www.youtube.com/watch?v=Pbs1wU7iVK8","http://www.youtube.com/watch?v=_ZMfQ0Aj7h8","http://www.youtube.com/watch?v=AEHJCP7F93E","http://www.youtube.com/watch?v=CD7aZ9MTuew","http://www.youtube.com/watch?v=r6En29azNBA","http://www.youtube.com/watch?v=EdCvpbr9XWM","http://www.youtube.com/watch?v=Bf01riuiJWA","http://www.youtube.com/watch?v=3UKRbLHdfGo","http://www.youtube.com/watch?v=gN3frDIyKt0","http://www.youtube.com/watch?v=oIproKMK9-s","http://www.youtube.com/watch?v=f-h8V9b0WWc","http://www.youtube.com/watch?v=m11wGyYtp6c","http://www.youtube.com/watch?v=OWbboGJfEYs","http://www.youtube.com/watch?v=od2q-e5K-Zc","http://www.youtube.com/watch?v=zsLT3JqfTn0","http://www.youtube.com/watch?v=aFSs8Eh-oH4","http://www.youtube.com/watch?v=g1e1EFqVIj4","http://www.youtube.com/watch?v=WxYno-Pc2YI","http://www.youtube.com/watch?v=76TKOxjbgNQ","http://www.youtube.com/watch?v=YTVvBCGlfpo","http://www.youtube.com/watch?v=BSC6d81pvwE","http://www.youtube.com/watch?v=yi2B0PFj-OQ","http://www.youtube.com/watch?v=j4Jyev7iTlE","http://www.youtube.com/watch?v=8GW6sLrK40k","http://www.youtube.com/watch?v=zR6fECxF44I","http://www.youtube.com/watch?v=AWuPGjjP2rc","http://www.youtube.com/watch?v=e5Ij0a4gkOQ","http://www.youtube.com/watch?v=6W6HhdqA95w","http://www.youtube.com/watch?v=iaOnc86eI_o","http://www.youtube.com/watch?v=Fkxox9xgL1U","http://www.youtube.com/watch?v=tRsAqklRBfw","http://www.youtube.com/watch?v=IrHD6WrX9NA","http://www.youtube.com/watch?v=ej2sugsP67A","http://www.youtube.com/watch?v=v8_TwwUh3Pc","https://www.youtube.com/watch?v=yrVsyTXHbpU","http://www.youtube.com/watch?v=wSpE6oE7-TI","http://www.youtube.com/watch?v=CvjRlYpXS5U","http://www.youtube.com/watch?v=4IJI6soiQhI","http://www.youtube.com/watch?v=jHAte-EbZ44","http://www.youtube.com/watch?v=J3KU26GMq_A","http://www.youtube.com/watch?v=hvkajRy0fww","http://www.youtube.com/watch?v=qKopP3sxKs4","http://www.youtube.com/watch?v=n11j73OYqOY","http://www.youtube.com/watch?v=v1wMBrkUEFE","http://www.youtube.com/watch?v=-U4t1B8IARU","http://www.youtube.com/watch?v=RnQofA9CNww","http://www.youtube.com/watch?v=ntX9LYIc5Ak","http://www.youtube.com/watch?v=4PkyrisXJvE","http://www.youtube.com/watch?v=2I6vVTOi_3o","https://www.youtube.com/watch?v=uUw3RexEEDQ","http://www.youtube.com/watch?v=xvpONIFbNKM","http://www.youtube.com/watch?v=SSeYQMRiElg","http://www.youtube.com/watch?v=IhPlLjvxRe8","http://www.youtube.com/watch?v=kp_51mkPEgg","http://www.youtube.com/watch?v=LBt60dfwEBY","http://www.youtube.com/watch?v=mGUjVbsYG6E","http://www.youtube.com/watch?v=IxXVgJdn-XU","http://www.youtube.com/watch?v=Jdt2JaUE89c","http://www.youtube.com/watch?v=ObURStyncIA","http://www.youtube.com/watch?v=8W4bT3nQkJ8","http://www.youtube.com/watch?v=I4M4XTsx2cA","http://www.youtube.com/watch?v=Dwa-81884m8","http://www.youtube.com/watch?v=cwY4dsU3nlI","http://www.youtube.com/watch?v=HGgIhyQTHS8","http://www.youtube.com/watch?v=YdA-OcRX1Xw","http://www.youtube.com/watch?v=JkR7zClEkAo","http://www.youtube.com/watch?v=tX6gSMocHaE","http://www.youtube.com/watch?v=QSkvyG3H_KM","http://www.youtube.com/watch?v=VNW9TAwImBY","http://www.youtube.com/watch?v=HJLE4so-Lyw","http://www.youtube.com/watch?v=cZPE-45HJIQ","http://www.youtube.com/watch?v=5HJCYgDnfGY","http://www.youtube.com/watch?v=DlpwLo4rZf0","http://www.youtube.com/watch?v=EcGxpmWNG3o","http://www.youtube.com/watch?v=arEOmQ_JpAw","http://www.youtube.com/watch?v=t1M6KsUY3o8","http://www.youtube.com/watch?v=FMNAcMNedOc","http://www.youtube.com/watch?v=1jQWgrgDlC4","http://www.youtube.com/watch?v=GwVvvFkjM-8","http://www.youtube.com/watch?v=ABQdXTtDV-A","http://www.youtube.com/watch?v=JWfezfD4wnU","http://www.youtube.com/watch?v=ibF_h7eDAl0","http://www.youtube.com/watch?v=pKXssMNYAg4","http://www.youtube.com/watch?v=2k3Besgn3-c","http://www.youtube.com/watch?v=QbVQGE_evC0","http://www.youtube.com/watch?v=9bCHjdaP4MI","http://www.youtube.com/watch?v=V32y9gHJP0E","http://www.youtube.com/watch?v=yDHWjWSxj2s","http://www.youtube.com/watch?v=XxthmuqWF1Q","http://www.youtube.com/watch?v=rT0o_pmJ_Bo","http://www.youtube.com/watch?v=ex_iu63m9wc","http://www.youtube.com/watch?v=BYUIUxGPX9s","http://www.youtube.com/watch?v=0SuBLhi236M","http://www.youtube.com/watch?v=pVoL7LYVMxY","http://www.youtube.com/watch?v=9JhYAJPTlyg","http://www.youtube.com/watch?v=Fb-NpzzGp5U","http://www.youtube.com/watch?v=6cRI48H4bjI","http://www.youtube.com/watch?v=dBvlnyvgOnw","http://www.youtube.com/watch?v=p_9nfo8ZI0o","http://www.youtube.com/watch?v=kglaRv-QhNw","http://www.youtube.com/watch?v=4xAGl8-qyPA","http://www.youtube.com/watch?v=IUpFZ93zkIg","http://www.youtube.com/watch?v=CzRmXyk40cU","http://www.youtube.com/watch?v=NI-Y-NCdbEw","http://www.youtube.com/watch?v=P-fMDaPFXME","http://www.youtube.com/watch?v=lTtqvQZZEV4","http://www.youtube.com/watch?v=W5HAYXU5J8M","http://www.youtube.com/watch?v=Tum-Qh7sE7M","http://www.youtube.com/watch?v=zHG27ZPiXfw","https://www.youtube.com/watch?v=Fka6d0QR5Pg","http://www.youtube.com/watch?v=hRAXbiFxo-8","http://www.youtube.com/watch?v=zQTVUCH6cmA","http://www.youtube.com/watch?v=H8ExSnVScBo","http://www.youtube.com/watch?v=aWPN6Mplurw","http://www.youtube.com/watch?v=ZiG-oUvB2FI","http://www.youtube.com/watch?v=vupeife70eI","http://www.youtube.com/watch?v=tHxfbJG8_BM","http://www.youtube.com/watch?v=KSRiZLlsy-M","http://www.youtube.com/watch?v=OVwSTgx2Y5A","http://www.youtube.com/watch?v=BbvhjmUiHHM","http://www.youtube.com/watch?v=cPJ58XpeN9c","https://www.youtube.com/watch?v=UtZnqKVd9WQ","http://www.youtube.com/watch?v=qm995hv3h8Q","http://www.youtube.com/watch?v=-kNx6sqReFk","http://www.youtube.com/watch?v=oNULayHdiA4","http://www.youtube.com/watch?v=nNDRKEdBwxY","http://www.youtube.com/watch?v=bF94LEr4KK8","https://www.youtube.com/watch?v=25T_6TWt2Ac","http://www.youtube.com/watch?v=hgEmI0HAcsw","http://www.youtube.com/watch?v=sGT-EvMabn4","https://www.youtube.com/watch?v=kt6z3E3Cu5Y","https://www.youtube.com/watch?v=jTNqImDAsms","https://www.youtube.com/watch?v=-Jj4s9I-53g","http://www.youtube.com/watch?v=E3VLrhpMNIE","http://www.youtube.com/watch?v=0HW0q13kBPU","http://www.youtube.com/watch?v=CHlE5zvy0Sg","http://www.youtube.com/watch?v=yfNyeOsNR4M","http://www.youtube.com/watch?v=biQpbDnMgVI","http://www.youtube.com/watch?v=iaxV6lG6uqg","https://www.youtube.com/watch?v=a3wGYbq6_Mc","https://www.youtube.com/watch?v=ibUOxEBxVsE","http://www.youtube.com/watch?v=11AjWfGZa_U","http://www.youtube.com/watch?v=QLsBLxvcqBs","http://www.youtube.com/watch?v=xvWBd4s_6zE","http://www.youtube.com/watch?v=V5OhmOOp9-M","http://www.youtube.com/watch?v=8b795YBf13Y","http://www.youtube.com/watch?v=dg4D8hUR0M8","http://www.youtube.com/watch?v=n9KjA471Y3k","http://www.youtube.com/watch?v=rc1z0yREyUA","http://www.youtube.com/watch?v=Q83b_etlJhc","http://www.youtube.com/watch?v=cxFFhUvlRiM","http://www.youtube.com/watch?v=c5gejcfpr1w","http://www.youtube.com/watch?v=FGWkTYMdt8Y","http://www.youtube.com/watch?v=mFJ6v6P_aik","http://www.youtube.com/watch?v=zhXUngCWx7I","http://www.youtube.com/watch?v=mHw_pfpFEqw","http://www.youtube.com/watch?v=yz5rI-zh_Xs","http://www.youtube.com/watch?v=JNABHWMdhr0","http://www.youtube.com/watch?v=VrHA0HugnuE","http://www.youtube.com/watch?v=5d__5a0FzHw","http://www.youtube.com/watch?v=BWib9T5AB98","http://www.youtube.com/watch?v=srEzqf7pRlE","http://www.youtube.com/watch?v=YyNVl_2n_O4","http://www.youtube.com/watch?v=BlwHxPQ759M","http://www.youtube.com/watch?v=paezrRzfOC8","http://www.youtube.com/watch?v=2dYXTbIGNK8","http://www.youtube.com/watch?v=12i5cCesvjQ","http://www.youtube.com/watch?v=zjAYEw3hc0Y","https://www.youtube.com/watch?v=jG47HeWmrN0","http://www.youtube.com/watch?v=O6yQ9pJzlk8","http://www.youtube.com/watch?v=6fhBo7kofas","http://www.youtube.com/watch?v=9BQd4bbLkI0","http://www.youtube.com/watch?v=Z0vfSmGpJ6Y","http://www.youtube.com/watch?v=4vGPyznu-Ys","http://www.youtube.com/watch?v=CTT9nY5S7YU","http://www.youtube.com/watch?v=ggHN5ZJ8jkU","http://www.youtube.com/watch?v=XRr5GMdZsZM","http://www.youtube.com/watch?v=Ne1VHRTaX7c","http://www.youtube.com/watch?v=Jp0mdYBkzKU","http://www.youtube.com/watch?v=KotSHHpJd2Q","http://www.youtube.com/watch?v=4PqZrMih3ws","http://www.youtube.com/watch?v=s0-DPX_RF4s","http://www.youtube.com/watch?v=6VOZbol2BIo","http://www.youtube.com/watch?v=Zp8paCvQjhY","http://www.youtube.com/watch?v=CdrLzooJVUc","http://www.youtube.com/watch?v=gMGEyl5TRa4"]

function test() {
    ytdl("https://www.youtube.com/playlist?list=UUPzWlhG7QM56Y8MYB3qMVnQ", {
        dumpSingleJson: true,
        yesPlaylist: true,
        flatPlaylist: true
    }).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e.message)
    })
}

function test2(finish, url, index) {
    ytdl(url, {
        dumpSingleJson: true,
        noPlaylist: true
    }).then(res => {
        console.log(`${index}: ${res.title}`)
    }).catch(e => {
        console.log(e.message);
    }).finally(() => {
        finish()
    })
}

let Limiter = function(max) {
    max = max || 10

    let count = 0
    let funcQueue = []

    function queue(func, ...args) {
        if (count >= max ) {
            funcQueue.push([func, args])
        } else {
            count += 1
            func(finish, ...args)
        }
    }

    function finish() {
        count -= 1
        if (funcQueue.length > 0) {
            let newCall = funcQueue.shift()
            newCall[0](finish, ...newCall[1])
        }
    }

    function setMax(newMax) {
        if (newMax >= 0) {
            max = newMax
        }
    }

    return {
        queue,
        setMax
    }
}()

let testTarget = test5
for (let index in testTarget) {
    console.log(index);
    Limiter.queue(test2, testTarget[index], index)
}

// id,
// uploader,
// uploader_id,
// webpage_url,
// extractor_key: 'YoutubeTab',
// title,
// extractor: 'youtube:tab'
// webpage_url_basename: 'playlist'
// _type: 'playlist',
// entries: [
// {
    // title,
    // url,
    // view_count: null,
    // _type: 'url',
    // ie_key: 'youtube',
    // id,
    // uploader,
    // description: null
// }
// ]