import { Question } from './types';

export const QUESTIONS: Question[] = [
  // Q1: 基本情報
  {
    id: 'q1',
    text: 'こんにちは。これから、お子さんの「個性の構成元素」を一緒に見つけていきますね。まず、お子さんのお名前（ニックネームでOK）と年齢を教えてください。',
    inputType: 'basic_info',
    primaryElements: [],
    secondaryElements: [],
  },
  // Q2: 成長した瞬間（セルフコントロール選択肢追加）
  {
    id: 'q2',
    text: '最近1〜2週間で、{childName}を見ていて「お、いいな」「成長したな」と感じた瞬間はありましたか？どんな場面が近いですか？（3つまで選べます）',
    inputType: 'multi_choice',
    maxSelection: 3,
    choices: [
      { id: 'q2_1', label: 'お友達や家族との関わりで' },
      { id: 'q2_2', label: '何かに挑戦している場面で' },
      { id: 'q2_3', label: '自分の気持ちを伝えてくれた時' },
      { id: 'q2_4', label: '何かに夢中になっている時' },
      { id: 'q2_6', label: 'セルフコントロール（感情を表現したり我慢できたりした）' },
      { id: 'q2_5', label: 'その他・自由に書く', isOther: true },
    ],
    followUpPrompt:
      'ありがとうございます。その時の{childName}の様子を、もう少しだけ教えてもらえますか？一言でも大丈夫です。',
    primaryElements: ['Cu', 'Sc'],
    secondaryElements: ['Rg', 'Gr', 'Em', 'Co'],
  },
  // Q3: 困った場面
  {
    id: 'q3',
    text: '逆に、最近「うーん、どうしたものか」と感じた場面はありますか？どんなタイプが近いですか？（3つまで選べます）',
    inputType: 'multi_choice',
    maxSelection: 3,
    choices: [
      { id: 'q3_1', label: '感情的になった・かんしゃく' },
      { id: 'q3_2', label: 'お友達やきょうだいとのトラブル' },
      { id: 'q3_3', label: 'やるべきことに取り組めない' },
      { id: 'q3_4', label: '自信がなさそうに見えた' },
      { id: 'q3_5', label: 'その他・自由に書く', isOther: true },
      { id: 'q3_6', label: '特に大きな心配はない', exclusive: true },
    ],
    followUpPrompt:
      'ありがとうございます。その時の{childName}の様子を、もう少しだけ教えてもらえますか？一言でも大丈夫です。',
    skipFollowUpIfAny: ['q3_6'],
    primaryElements: ['Rg'],
    secondaryElements: ['Gr', 'Co', 'Sc'],
  },
  // Q6 → 3番目に移動: うまくいかない時の反応（困りごとの直後）
  {
    id: 'q6',
    text: '何かがうまくいかない時（積み木が崩れた、ゲームで負けた、難しい課題など）、{childName}はどんな反応が多いですか？（3つまで選べます）',
    inputType: 'multi_choice',
    maxSelection: 3,
    choices: [
      { id: 'q6_1', label: '泣いたり怒ったり感情が爆発する' },
      { id: 'q6_2', label: 'やめてしまう・避けてしまう' },
      { id: 'q6_3', label: 'もう一度自分で挑戦する' },
      { id: 'q6_4', label: '誰かに助けを求める' },
      { id: 'q6_5', label: 'その他・自由に書く', isOther: true },
    ],
    followUpPrompt:
      'ありがとうございます。その時の{childName}の様子を、もう少しだけ教えてもらえますか？一言でも大丈夫です。',
    primaryElements: ['Rg', 'Gr', 'Sc'],
    secondaryElements: [],
  },
  // Q4: 他の子との関わり
  {
    id: 'q4',
    text: '{childName}が他のお子さんと一緒にいる時、どんな様子が多いですか？（3つまで選べます）',
    inputType: 'multi_choice',
    maxSelection: 3,
    choices: [
      { id: 'q4_1', label: 'グループの中心にいることが多い' },
      { id: 'q4_2', label: 'マイペースで一人遊びも好き' },
      { id: 'q4_3', label: '場面によって変わる' },
      { id: 'q4_4', label: '受け身だけど楽しんでいる' },
      { id: 'q4_5', label: 'その他・自由に書く', isOther: true },
      { id: 'q4_6', label: 'まだお友達との関わりは少ない', exclusive: true },
    ],
    followUpPrompt:
      'ありがとうございます。その時の{childName}の様子を、もう少しだけ教えてもらえますか？一言でも大丈夫です。',
    primaryElements: ['Em', 'Co'],
    secondaryElements: ['Rg'],
  },
  // Q5: 夢中になっていること（音楽追加、表現する系に変更）
  {
    id: 'q5',
    text: '今、{childName}が夢中になっていることは何ですか？（3つまで選べます）',
    inputType: 'multi_choice',
    maxSelection: 3,
    choices: [
      { id: 'q5_1', label: '表現する系（工作、絵、ブロック、音楽など）' },
      { id: 'q5_2', label: '体を動かす系（スポーツ、ダンス、外遊び）' },
      { id: 'q5_3', label: '読む・知る系（本、図鑑、観察）' },
      { id: 'q5_4', label: 'ごっこ遊び・想像の世界' },
      { id: 'q5_5', label: 'デジタル・ゲーム系' },
      { id: 'q5_6', label: 'その他・自由に書く', isOther: true },
    ],
    followUpPrompt:
      'ありがとうございます。その時の{childName}の様子を、もう少しだけ教えてもらえますか？一言でも大丈夫です。',
    primaryElements: ['Cu', 'Gr'],
    secondaryElements: ['Sc'],
  },
  // Q7: 親の願い
  {
    id: 'q7',
    text: '最後に、{childName}に「こんな大人になってほしいな」という願いはありますか？一言でも大丈夫です。',
    inputType: 'free_text_only',
    primaryElements: [],
    secondaryElements: [],
  },
];
