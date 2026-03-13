# 🚀 天空战记 - Android APK 构建指南

## 📦 项目已准备

Capacitor + Android 项目已创建完成！

## 🛠️ 构建 APK 方法

### 方法一：本地构建（推荐，需要网络）

**前提条件：**
- Android Studio 已安装
- Android SDK 已配置
- JDK 17+ 已安装

**步骤：**

1. **打开项目**
   ```bash
   cd /home/Way-Kwok_Chu/.openclaw/workspace-taizi/sky-shooter-android
   ```

2. **在 Android Studio 中打开**
   - 启动 Android Studio
   - File → Open → 选择 `android` 文件夹
   - 等待 Gradle 同步完成

3. **构建 APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - 完成后 APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

4. **安装到手机**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### 方法二：命令行构建（需要 Gradle 网络）

```bash
cd /home/Way-Kwok_Chu/.openclaw/workspace-taizi/sky-shooter-android/android
./gradlew assembleDebug
```

APK 位置：`android/app/build/outputs/apk/debug/app-debug.apk`

---

### 方法三：使用在线构建服务

如果本地网络不好，可以使用：
- **GitHub Actions** - 自动构建
- **Codemagic** - 免费移动应用 CI/CD
- **Appetize.io** - 云端测试

---

### 方法四：使用 Website 2 APK 工具（最简单）

下载第三方工具直接转换 HTML 为 APK：
- **Website 2 APK Builder** (Windows)
- **Web2Desk** (跨平台)
- **Cordova CLI** (需要先安装)

---

## 📱 项目结构

```
sky-shooter-android/
├── www/                    # 网页游戏文件
│   ├── index.html
│   ├── css/style.css
│   └── js/game.js
├── android/                # Android 原生项目
│   └── app/
│       └── src/main/
│           └── assets/public/  # 游戏文件会复制到这里
├── capacitor.config.json   # Capacitor 配置
└── package.json
```

---

## ⚙️ 配置说明

**应用信息：**
- 名称：天空战记
- 包名：com.skyshooter.game
- 版本：1.0.0

**修改配置：**
编辑 `capacitor.config.json`

---

## 🎮 游戏操作

- **触摸拖动** - 控制飞机移动
- **自动射击** - 无需手动操作

---

## 📝 注意事项

1. **签名**：正式发布需要签名证书
2. **权限**：当前版本无需特殊权限
3. **适配**：已适配不同屏幕尺寸
4. **性能**：建议在真机上测试

---

**构建时间**: 2026-03-13
**版本**: 1.0.0
