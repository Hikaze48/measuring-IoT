# ESP32を用いた環境測定によるIoT機器

# 機器の目的
・テーマ：with コロナ
・「コロナ禍だと部屋にこもりがち。　→　換気を怠ってしまう。　→　体に悪い影響を及ぼす。」を防ぐために！  
・環境測定をし、換気を行うタイミングを報告してくれる機器で、適度な換気を行えるようにする。

# 作成した機器
・喚起を行うタイミングを報告するために必要な情報  
1.CO2濃度（室内の基準は1300ppm以下となっている。）  
2.温度  
3.湿度（温度と湿度から不快指数が求まり、蒸し暑さを示す。60～70だと快適） 

・CO2濃度が1300ppm以上、もしくは不快指数が60～70以外だと換気を促すようにする機器を作成。

・ESP32  
・CO2センサ（MH-Z19C）  
・温湿度センサ（DHT11）  
・圧力センサ（MF01A-N-221-A04）  
・液晶ディスプレイ（ILI9341）  
・SDカード　　　　　　　　　　　　で構成
![DSC_1251~3](https://github.com/Hikaze48/measuring-IoT/assets/172498055/d9432d02-fbc7-4247-887a-8a70a22352c7)


# 機器の機能
・液晶ディスプレイに二酸化炭素濃度、温度、湿度、環境が安全か危険かを表示してくれる。圧力センサをおしたり、画面をタッチすると、二酸化炭素濃度、温度、湿度のグラフを表示します。（測定間間隔は1秒毎）  

・CO2濃度が1300ppm以上もしくは、不快指数が60～70以上の場合に環境が危険と表示されます。
![DSC_1252](https://github.com/Hikaze48/measuring-IoT/assets/172498055/0b94535d-917e-4f5b-a9c0-1219bf55255c)
![DSC_1251~2](https://github.com/Hikaze48/measuring-IoT/assets/172498055/ee97d0a2-781e-47ae-a9aa-ac4d4c1cf051)

・近くにあるWiFiルータに接続し、液晶ディスプレイに書いてあるIPアドレスにアクセスすると、CO2濃度、不快度指数、温度、湿度のグラフが表示される（1秒毎にプロット）  
・もしも、WiFiルータに接続できない場合、アクセスポイントが作成され接続すると、WiFiの時と、ほとんど同様の動作をする。（1秒ごとにプロット）
![スクリーンショット 2023-12-27 020932](https://github.com/Hikaze48/measuring-IoT/assets/172498055/1fe92953-4f35-4a48-8cf6-ae7c020f4b51)

・WiFi接続時、CO2濃度が1300ppm以上もしくは、不快指数が60～70以外の場合、スマホのLINEに「危険な環境です。」と通知が来ます。
![Screenshot_20231227-023109](https://github.com/Hikaze48/measuring-IoT/assets/172498055/479c35e7-bce7-436d-8501-d54da382e9bb)

・SDカードの中にCO2濃度、温度、湿度、不快指数、を.csvファイルとして記録する。.csvファイルのため容易にグラフ化ができます。
![スクリーンショット 2023-12-27 184706](https://github.com/Hikaze48/measuring-IoT/assets/172498055/f9ee602f-9a9f-42c7-8156-1b0c5edb11ed)

・「テーマ：with コロナ」で娯楽要素も欲しいと思った為、Webページ上でミニゲームができるようにしました。
![スクリーンショット 2024-06-12 232514](https://github.com/Hikaze48/measuring-IoT/assets/172498055/d16364d4-9982-46c7-bde8-70551880ecd4)

# 作成したプログラムと説明
![スライド5](https://github.com/Hikaze48/measuring-IoT/assets/172498055/8967b4dc-cf98-432b-babf-2398ee15f0a8)

# 使用ライブラリ
・aruduinoWebSocekets-master  
・AsyncTCP-master  
・elapsedMillis-1.06  
・ESPAsyncWebServer-master  
・mhz19_uart-master  
・sdfonts  
・TFT_eSPI-master  
・WebServer_tng-master  

# 使用方法
・PlatformIOで作成  
・プロジェクト内に作成したdataフォルダに以下を置く  
1.Chart.min.js  
2.game.js  
3.game.html  
4.index.html  
5.favicon.ico（16 x 16 ピクセルのアイコン）  
6.player.png（48 x 48 ピクセル）  
7.enemy.png（48 x 48 ピクセル）  
8.moon.png（64 x 64 ピクセル）  
9.tree.png（128 x 128 ピクセル）  
・プロジェクト内のincludeフォルダにindex_html2.hを置く  
・プロジェクト内のsrc内にmain.cppを置く  
