# LinuxDo Scripts

LinuxDo Scriptsは、LinuxDoフォーラムの利用体験を向上させるために設計された多機能なブラウザ拡張機能です。基本的なインターフェースの最適化から高度なAI支援機能まで、多くの実用的な機能を統合し、フォーラムの閲覧や交流をよりスムーズかつ効率的にします。

## ✨ 主な機能

### 🔍 閲覧体験の最適化
- トピックリストに作成日時を表示
- フロア番号の表示
- 新しいタブでトピックを開く
- トピックリストで詳細やコメントを直接プレビュー
- 中日英混在表示の最適化
- 署名画像の表示最適化、画像の破損防止
- 自動ダークモード切替

### 📚 コンテンツ管理
- 完全なブックマーク機能
- ユーザータグ機能
- 指定ユーザーのトピックを強制ブロック（ブラックリスト）
- オリジナルポスターのみ表示切替

### 💬 交流強化
- トピックへのクイック返信（カスタマイズ対応）
- コメントボックスの絵文字最適化
- フロア抽選機能
- レベル情報の照会

### 🤖 AIインテリジェンス
- AIによるトピック要約
- スマート返信生成
- AI支援返信

### 🎨 パーソナライズ
- フォーラムテーマスキンの切替
- フォーラム絵文字スタイルの切替
- カスタムCSSスタイル対応
- 設定パネルデータの同期

## 📥 インストールと使用方法

### 対応ブラウザ
- **Chrome / Edge / Arc / Brave**：[Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **中国本土ユーザー**：[Crxストア](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Firefox**：[Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

## 🛠️ 開発ガイド

### 必要環境
```
node: v22.12.0
```

### ローカル開発
1. リポジトリをクローンし、依存関係をインストール：
```shell
git clone https://github.com/ezyshu/linuxdo-scripts
npm install
```

2. 開発サーバーを起動：
```shell
npm run dev
```

3. 拡張機能を読み込む：
- ローカルの `.output` フォルダを開く
- `chrome-mv3` フォルダを `chrome://extensions/` にドラッグ

### 開発注意事項
- コンポーネントベースの開発
- 各新機能は独立したコンポーネントとして開発し、競合を回避
- PR提出後にコードレビュー、重大な問題がなければ迅速にマージ

## 🚀 コントリビューター

![Contributor](https://contrib.rocks/image?repo=ezyshu/linuxdo-scripts)

## 🤝 貢献ガイド

新機能の提案や改善案を歓迎します！以下の方法でプロジェクトに参加できます：
- Issueを提出して問題や提案を報告
- Pull Requestでコードを貢献
- Discordコミュニティに参加して議論

## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ezyshu/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#ezyshu/linuxdo-scripts&Timeline)

## 📄 ライセンス

本プロジェクトはMITライセンスの下でオープンソース化されています。詳細は[LICENSE](../LICENSE)ファイルをご覧ください。

## 📖 免責事項

本プロジェクトは無料かつオープンソースですが、完全にバグがないことを保証するものではありません。ご利用は自己責任でお願いします。関連する法律や規則を遵守し、悪用しないでください。

万が一、権利侵害があれば[ezyshu](https://github.com/ezyshu)までご連絡ください。迅速に対応いたします。 