import React, { useEffect, useMemo, useRef, useState } from "react";
import Phaser from "phaser";

type ProductId = "rawTea" | "milkTea" | "bun" | "banana" | "biscuit";
type Product = { id: ProductId; name: string; icon: string; price: number; seconds: number; cost: number; ingredient: string };
type Order = { id: number; guest: string; avatar: string; item: ProductId; status: "waiting" | "cooking" | "ready" | "served"; created: number };
type Cooking = { id: number; item: ProductId; stove: number; doneAt: number };

const PRODUCTS: Product[] = [
  { id: "rawTea", name: "রং চা", icon: "🍵", price: 10, seconds: 6, cost: 2, ingredient: "চা পাতা" },
  { id: "milkTea", name: "দুধ চা", icon: "☕", price: 15, seconds: 8, cost: 3, ingredient: "দুধ + চা পাতা" },
  { id: "bun", name: "বন", icon: "🍞", price: 10, seconds: 4, cost: 2, ingredient: "বন" },
  { id: "banana", name: "কলা", icon: "🍌", price: 8, seconds: 0, cost: 1, ingredient: "কলা" },
  { id: "biscuit", name: "বিস্কুট", icon: "🍪", price: 5, seconds: 0, cost: 1, ingredient: "বিস্কুট" }
];
const GUESTS = [
  { name: "রনি ভাই", avatar: "👨🏽" }, { name: "মিতু", avatar: "👩🏻" },
  { name: "বাবলু", avatar: "🧔🏽" }, { name: "সজীব", avatar: "👨🏻‍🎓" },
  { name: "নাসিমা খালা", avatar: "👩🏽" }
];
const EVENTS = ["পাশের টেবিলে বিল নিয়ে তর্ক শুরু হয়েছে!", "একজন কাস্টমার বলছে, চায়ে চিনি কম!", "পুলিশ টহল দিতে এসে দোকানের সামনে থামল।", "হঠাৎ দোকানে কাস্টমারের ভিড় বেড়ে গেল!", "একজন বলছে, গতকালের বাকি আগে মেটাবেন!"];

class TongbajScene extends Phaser.Scene {
  constructor() { super("TongbajScene"); }
  create() {
    const w = 1100, h = 650;
    const g = this.add.graphics();
    g.fillGradientStyle(0xf7dcae, 0xf7dcae, 0xe9c48e, 0xe9c48e, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0xd8b17c, 1); g.fillRect(0, 475, w, 175);
    g.fillStyle(0xb78d5f, 1); g.fillRect(0, 474, w, 8);
    // distant neighbourhood
    for (let i = 0; i < 7; i++) {
      const x = i * 165 - 18;
      g.fillStyle(i % 2 ? 0xc5b39a : 0xb8a58c, 1);
      g.fillRoundedRect(x, 120 + (i % 3) * 18, 135, 355, 8);
      g.fillStyle(0x8c9a88, 1);
      for (let j = 0; j < 3; j++) g.fillRect(x + 18 + j * 36, 165 + (i % 3) * 18, 20, 42);
      g.fillStyle(0x9a7958, 1); g.fillRect(x + 50, 405, 35, 70);
    }
    // tea stall body and tin roof
    g.fillStyle(0x31594a, 1); g.fillRoundedRect(320, 170, 475, 295, 12);
    g.fillStyle(0x244638, 1); g.fillRoundedRect(300, 145, 515, 42, 8);
    g.fillStyle(0xd5a34a, 1); g.fillRect(310, 178, 495, 12);
    for (let i = 0; i < 12; i++) {
      g.lineStyle(2, 0x496c5d, 0.8); g.lineBetween(315 + i * 42, 145, 325 + i * 42, 185);
    }
    g.fillStyle(0xf6d58c, 1); g.fillRoundedRect(430, 197, 250, 48, 8);
    this.add.text(555, 221, "মায়ের দোয়া টং", { fontFamily: "Hind Siliguri", fontSize: "27px", fontStyle: "bold", color: "#244638" }).setOrigin(0.5);
    // counter, shelves and products
    g.fillStyle(0x8a5736, 1); g.fillRoundedRect(345, 340, 430, 80, 8);
    g.fillStyle(0xb77a4a, 1); g.fillRect(345, 340, 430, 16);
    g.fillStyle(0x68452f, 1); g.fillRect(365, 420, 18, 45); g.fillRect(735, 420, 18, 45);
    g.fillStyle(0xe5d2a8, 1); g.fillRoundedRect(380, 275, 80, 48, 7);
    g.fillStyle(0xd4a34f, 1); g.fillRoundedRect(490, 275, 90, 48, 7);
    g.fillStyle(0xb7d0c2, 1); g.fillRoundedRect(610, 275, 80, 48, 7);
    this.add.text(420, 299, "চায়ের কেটলি", { fontFamily: "Hind Siliguri", fontSize: "14px", color: "#493522" }).setOrigin(0.5);
    this.add.text(535, 299, "৩টি চুলা", { fontFamily: "Hind Siliguri", fontSize: "15px", color: "#493522" }).setOrigin(0.5);
    this.add.text(650, 299, "নাস্তা", { fontFamily: "Hind Siliguri", fontSize: "15px", color: "#493522" }).setOrigin(0.5);
    // benches and stools
    for (let i = 0; i < 3; i++) {
      g.fillStyle(0x9d4637, 1); g.fillRoundedRect(120 + i * 300, 520, 205, 22, 8);
      g.fillStyle(0x704a35, 1); g.fillRect(140 + i * 300, 540, 10, 35); g.fillRect(295 + i * 300, 540, 10, 35);
    }
    // lamp
    g.fillStyle(0x514638, 1); g.fillRect(850, 100, 5, 125);
    g.fillStyle(0xf6c75f, 1); g.fillCircle(852, 230, 19);
    g.fillStyle(0xffe7a6, 0.14); g.fillCircle(852, 230, 55);
    // street plants
    for (let i = 0; i < 5; i++) {
      g.fillStyle(0x567d4c, 1); g.fillCircle(40 + i * 250, 460, 20);
      g.fillStyle(0x79543a, 1); g.fillRect(35 + i * 250, 465, 10, 22);
    }
    // customers
    GUESTS.slice(0, 4).forEach((guest, i) => {
      const x = 205 + i * 225, y = 495;
      const body = this.add.container(x, y);
      const shadow = this.add.ellipse(0, 20, 72, 15, 0x6c4d32, 0.18);
      const avatar = this.add.text(0, -13, guest.avatar, { fontSize: "46px" }).setOrigin(0.5);
      const name = this.add.text(0, 29, guest.name, { fontFamily: "Hind Siliguri", fontSize: "15px", color: "#493522", backgroundColor: "#fff5df", padding: { x: 7, y: 3 } }).setOrigin(0.5);
      body.add([shadow, avatar, name]);
      this.tweens.add({ targets: avatar, y: -17, duration: 1100 + i * 170, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      avatar.setInteractive({ useHandCursor: true });
      avatar.on("pointerdown", () => this.game.events.emit("guest-click", guest));
    });
    // player avatar marker
    const player = this.add.container(890, 405);
    const playerShadow = this.add.ellipse(0, 28, 70, 16, 0x6c4d32, 0.2);
    const playerAvatar = this.add.text(0, -6, "🧑🏻‍🍳", { fontSize: "58px" }).setOrigin(0.5);
    const playerName = this.add.text(0, 38, "আপনি · দোকানদার", { fontFamily: "Hind Siliguri", fontSize: "15px", color: "#fff", backgroundColor: "#244638", padding: { x: 8, y: 4 } }).setOrigin(0.5);
    player.add([playerShadow, playerAvatar, playerName]);
    this.tweens.add({ targets: playerAvatar, y: -10, duration: 1250, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.add.text(550, 620, "টংয়ের আড্ডা · প্র্যাকটিস ম্যাপ", { fontFamily: "Hind Siliguri", fontSize: "16px", color: "#775638" }).setOrigin(0.5);
  }
}

export default function App() {
  const gameMount = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [screen, setScreen] = useState<"home" | "game">("home");
  const [seconds, setSeconds] = useState(180);
  const [cash, setCash] = useState(200);
  const [revenue, setRevenue] = useState(0);
  const [stock, setStock] = useState<Record<ProductId, number>>({ rawTea: 5, milkTea: 5, bun: 4, banana: 4, biscuit: 6 });
  const [ready, setReady] = useState<Record<ProductId, number>>({ rawTea: 0, milkTea: 0, bun: 0, banana: 0, biscuit: 0 });
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, guest: "রনি ভাই", avatar: "👨🏽", item: "milkTea", status: "waiting", created: Date.now() },
    { id: 2, guest: "মিতু", avatar: "👩🏻", item: "rawTea", status: "waiting", created: Date.now() },
    { id: 3, guest: "বাবলু", avatar: "🧔🏽", item: "bun", status: "waiting", created: Date.now() }
  ]);
  const [cooking, setCooking] = useState<Cooking[]>([]);
  const [eventText, setEventText] = useState("আজকের আড্ডা জমজমাট। আগে অর্ডার সামলান, মামা!");
  const [toast, setToast] = useState("");
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [missions, setMissions] = useState([false, false, false, false]);
  const [servedCount, setServedCount] = useState(0);
  const [showMini, setShowMini] = useState(false);
  const [miniNumber, setMiniNumber] = useState(7);
  const [miniAnswer, setMiniAnswer] = useState("");
  const [miniWon, setMiniWon] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const remainingStoves = useMemo(() => [0, 1, 2].filter((stove) => !cooking.some((task) => task.stove === stove)), [cooking]);
  const moneyText = (value: number) => "৳" + value.toLocaleString("en-US");
  const product = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };

  useEffect(() => {
    if (!gameMount.current || screen !== "game" || gameRef.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO, parent: gameMount.current, width: 1100, height: 650,
      backgroundColor: "#e9c48e",
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { antialias: true, pixelArt: false },
      scene: [TongbajScene]
    });
    gameRef.current = game;
    const onGuest = (guest: { name: string; avatar: string }) => {
      const item = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      setOrders((old) => [...old, { id: Date.now(), guest: guest.name, avatar: guest.avatar, item: item.id, status: "waiting", created: Date.now() }]);
      notify(guest.name + " নতুন অর্ডার দিয়েছে!");
    };
    game.events.on("guest-click", onGuest);
    return () => {
      game.events.off("guest-click", onGuest);
      game.destroy(true);
      gameRef.current = null;
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "game" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [screen, seconds > 0]);

  useEffect(() => {
    if (screen !== "game") return;
    const ticker = window.setInterval(() => {
      const now = Date.now();
      setCooking((current) => {
        const completed = current.filter((task) => task.doneAt <= now);
        if (completed.length) {
          setReady((old) => {
            const next = { ...old };
            completed.forEach((task) => { next[task.item] += 1; });
            return next;
          });
          setOrders((old) => old.map((order) => completed.some((task) => task.item === order.item && order.status === "cooking") ? { ...order, status: "ready" } : order));
          notify("চা/নাস্তা তৈরি! এখন সার্ভ করুন।");
        }
        return current.filter((task) => task.doneAt > now);
      });
    }, 250);
    return () => window.clearInterval(ticker);
  }, [screen]);

  const startGame = () => {
    setScreen("game"); setSeconds(180); setCash(200); setRevenue(0); setServedCount(0);
    setMissions([false, false, false, false]);
    setOrders([
      { id: Date.now() + 1, guest: "রনি ভাই", avatar: "👨🏽", item: "milkTea", status: "waiting", created: Date.now() },
      { id: Date.now() + 2, guest: "মিতু", avatar: "👩🏻", item: "rawTea", status: "waiting", created: Date.now() },
      { id: Date.now() + 3, guest: "বাবলু", avatar: "🧔🏽", item: "bun", status: "waiting", created: Date.now() }
    ]);
    setStock({ rawTea: 5, milkTea: 5, bun: 4, banana: 4, biscuit: 6 });
    setReady({ rawTea: 0, milkTea: 0, bun: 0, banana: 0, biscuit: 0 });
    setCooking([]);
  };
  const buyStock = (id: ProductId) => {
    const cost = id === "rawTea" ? 20 : id === "milkTea" ? 30 : id === "bun" ? 25 : id === "banana" ? 18 : 15;
    if (cash < cost) return notify("ক্যাশ কম! আগে বিক্রি বাড়ান, মামা।");
    setCash((v) => v - cost); setStock((v) => ({ ...v, [id]: v[id] + 5 }));
    notify(product(id).name + " স্টক +৫");
  };
  const cook = (id: ProductId) => {
    if (stock[id] <= 0) return notify("স্টক শেষ! আগে মাল কিনুন।");
    if (remainingStoves.length === 0) return notify("তিনটা চুলাই ব্যস্ত। একটু ধৈর্য ধরুন!");
    const p = product(id);
    if (p.seconds === 0) {
      setStock((v) => ({ ...v, [id]: v[id] - 1 }));
      setReady((v) => ({ ...v, [id]: v[id] + 1 }));
      notify(p.name + " সার্ভ করার জন্য প্রস্তুত।");
      return;
    }
    const stove = remainingStoves[0];
    setStock((v) => ({ ...v, [id]: v[id] - 1 }));
    setCooking((v) => [...v, { id: Date.now(), item: id, stove, doneAt: Date.now() + p.seconds * 1000 }]);
    setOrders((v) => {
      const idx = v.findIndex((o) => o.item === id && o.status === "waiting");
      if (idx < 0) return v;
      return v.map((o, i) => i === idx ? { ...o, status: "cooking" } : o);
    });
    notify(p.name + " চুলায় দেওয়া হয়েছে · " + p.seconds + " সেকেন্ড");
  };
  const serve = (order: Order) => {
    if (ready[order.item] <= 0) return notify("এই আইটেম এখনো তৈরি হয়নি!");
    const p = product(order.item);
    setReady((v) => ({ ...v, [order.item]: v[order.item] - 1 }));
    setOrders((v) => v.map((o) => o.id === order.id ? { ...o, status: "served" } : o));
    setCash((v) => v + p.price); setRevenue((v) => v + p.price); setServedCount((v) => v + 1);
    if (servedCount >= 1) setMissions((v) => v.map((x, i) => i === 0 ? true : x));
    notify(order.guest + " কে " + p.name + " পরিবেশন করা হয়েছে। +" + moneyText(p.price));
  };
  const triggerEvent = () => setEventText(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
  const runMiniGame = () => { setMiniNumber(Math.floor(Math.random() * 8) + 4); setMiniAnswer(""); setMiniWon(false); setShowMini(true); };
  const submitMini = () => {
    if (Number(miniAnswer) === miniNumber * 3) { setMiniWon(true); setMissions((v) => v.map((x, i) => i === 2 ? true : x)); }
    else notify("হিসাব ভুল! ক্যালকুলেটর মামার কাছে জমা দিন।");
  };
  const formatTime = (s: number) => Math.floor(s / 60).toString().padStart(2, "0") + ":" + (s % 60).toString().padStart(2, "0");

  if (screen === "home") return (
    <main className="home-screen">
      <div className="home-top"><div className="brand-mark">টং<span>বাজ</span></div><div className="home-actions"><button className="ghost-button" onClick={() => setLanguage(language === "bn" ? "en" : "bn")}>{language === "bn" ? "বাংলা" : "English"}</button><button className="icon-button" onClick={() => setShowSettings(true)}>⚙</button></div></div>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"></span> BANGLADESHI TEA STALL SOCIAL GAME</div><h1>চা, চালাকি<br/><em>আর ঝামেলার আড্ডা!</em></h1><p>টংয়ের দোকানে সবাই কাস্টমার না। কেউ চা খায়, কেউ হিসাব মেলায়, আর কেউ গোপনে দোকানের বারোটা বাজায়!</p><div className="hero-buttons"><button className="primary-button" onClick={startGame}>প্র্যাকটিস শুরু করুন <span>↗</span></button><button className="secondary-button" onClick={() => notify("অনলাইন মাল্টিপ্লেয়ার পরের ডেভেলপমেন্ট ধাপে আসছে।")}>অনলাইন ম্যাচ <span className="soon">শীঘ্রই</span></button></div><div className="hero-meta"><span>◉ 2D GAME</span><span>◷ ৩ মিনিটের রাউন্ড</span><span>♟ ৪–৫ জনের ম্যাচ পরিকল্পিত</span></div></div>
        <div className="hero-art"><div className="sun"></div><div className="art-cloud cloud-one"></div><div className="art-cloud cloud-two"></div><div className="art-shop"><div className="shop-roof"></div><div className="shop-sign">মায়ের দোয়া টং</div><div className="shop-counter"><span>☕</span><span>🍵</span><span>🥟</span></div><div className="shop-legs"></div></div><div className="art-customer c-one">👨🏽‍🦱</div><div className="art-customer c-two">👩🏻</div><div className="art-customer c-three">🧔🏽</div><div className="art-speech">মামা, চা কড়া দিয়েন!</div><div className="art-stool"></div><div className="art-caption">ঢাকার অলিগলির এক কাপ গল্প</div></div>
      </section>
      <section className="feature-strip"><div><b>০১</b><span><strong>টং চালান</strong><small>অর্ডার, চুলা, স্টক আর লাভের হিসাব</small></span></div><div><b>০২</b><span><strong>গোলমাল ধরুন</strong><small>কে আসল, কে গোপন ঝামেলাবাজ?</small></span></div><div><b>০৩</b><span><strong>মিশন শেষ করুন</strong><small>আর্কেড, গোপন কাজ আর বোনাস</small></span></div></section>
      <footer className="home-footer"><span>টংবাজ © ২০২৬</span><span>চা ঠান্ডা হতে পারে, ঝামেলা না।</span><span>প্রোটোটাইপ · প্র্যাকটিস মোড</span></footer>
      {showSettings && <div className="modal-backdrop" onClick={() => setShowSettings(false)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowSettings(false)}>×</button><h2>সেটিংস</h2><p>ভাষা: {language === "bn" ? "বাংলা" : "English"}</p><button className="secondary-button full" onClick={() => setLanguage(language === "bn" ? "en" : "bn")}>ভাষা পরিবর্তন</button><p className="muted">সাউন্ড ও অ্যাকাউন্ট সেটিংস পরের ধাপে যোগ হবে।</p></div></div>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );

  return (
    <main className="game-screen">
      <header className="game-header"><div className="game-brand">টং<span>বাজ</span></div><div className="round-info"><span className="practice-tag">প্র্যাকটিস মোড · AI অতিথি</span><span className="round-clock">◷ {formatTime(seconds)}</span></div><div className="header-right"><span className="cash-pill">৳ {cash}</span><button className="exit-button" onClick={() => setScreen("home")}>বের হন</button></div></header>
      <div className="game-layout">
        <section className="world-column"><div className="world-heading"><div><span className="section-kicker">আপনার ব্যবসা</span><h2>মায়ের দোয়া টং</h2></div><span className="weather-pill">☀️ বিকেলের আড্ডা</span></div><div className="game-world"><div ref={gameMount} className="phaser-mount"></div><div className="world-hint">কাস্টমারের অবতারে ক্লিক করুন, নতুন অর্ডার আসবে</div></div><div className="event-banner"><span className="event-icon">📢</span><div><b>পাড়ার খবর</b><p>{eventText}</p></div><button onClick={triggerEvent}>নতুন ঘটনা</button></div><div className="world-stats"><div><small>মোট বিক্রি</small><b>{moneyText(revenue)}</b></div><div><small>পরিবেশন</small><b>{servedCount} টি</b></div><div><small>চুলা ব্যস্ত</small><b>{cooking.length}/৩</b></div><div><small>স্টক আইটেম</small><b>{Object.values(stock).reduce((a, b) => a + b, 0)} টি</b></div></div></section>
        <aside className="dashboard">
          <div className="dash-title"><div><span className="section-kicker">SHOPKEEPER DASHBOARD</span><h2>দোকানের হিসাব</h2></div><span className="role-chip">☕ দোকানদার</span></div>
          <section className="dash-section"><div className="section-title"><h3>অর্ডার বোর্ড</h3><span>{orders.filter((o) => o.status !== "served").length} pending</span></div><div className="order-list">{orders.slice(-6).reverse().map((order) => <div className="order-row" key={order.id}><span className="order-avatar">{order.avatar}</span><div className="order-main"><b>{order.guest}</b><small>{product(order.item).icon} {product(order.item).name} · {moneyText(product(order.item).price)}</small></div><span className={"status status-" + order.status}>{order.status === "waiting" ? "অপেক্ষা" : order.status === "cooking" ? "চুলায়" : order.status === "ready" ? "তৈরি" : "দেওয়া হয়েছে"}</span>{order.status === "ready" && <button className="serve-button" onClick={() => serve(order)}>দেন</button>}</div>)}{orders.length === 0 && <p className="empty-state">এখনো অর্ডার আসেনি।</p>}</div></section>
          <section className="dash-section"><div className="section-title"><h3>তিনটি গ্যাসের চুলা</h3><span>রান্না ও সার্ভিস</span></div><div className="stove-grid">{[0,1,2].map((stove) => { const task = cooking.find((t) => t.stove === stove); const p = task ? product(task.item) : null; const pct = task && p ? Math.max(0, 100 - ((task.doneAt - Date.now()) / (p.seconds * 1000)) * 100) : 0; return <div className={"stove-card " + (task ? "active" : "")} key={stove}><div className="stove-flame">{task ? "🔥" : "◉"}</div><b>চুলা {stove + 1}</b><small>{task && p ? p.name + " রান্না হচ্ছে" : "খালি আছে"}</small>{task && <div className="progress-track"><i style={{ width: pct + "%" }}></i></div>}</div>; })}</div></section>
          <section className="dash-section"><div className="section-title"><h3>মেনু ও কাঁচামাল</h3><span>স্টক কিনুন, রান্না করুন</span></div><div className="product-list">{PRODUCTS.map((p) => <div className="product-row" key={p.id}><span className="product-icon">{p.icon}</span><div className="product-info"><b>{p.name}</b><small>{moneyText(p.price)} · {p.seconds ? p.seconds + " সেকেন্ড" : "রেডি আইটেম"} · স্টক {stock[p.id]}</small></div><button className="mini-buy" onClick={() => buyStock(p.id)}>+৫ কিনুন</button><button className="cook-button" disabled={stock[p.id] <= 0 || remainingStoves.length === 0 && p.seconds > 0} onClick={() => cook(p.id)}>{p.seconds ? "রান্না" : "রেডি"}</button></div>)}</div></section>
          <section className="dash-section mission-section"><div className="section-title"><h3>আজকের মিশন</h3><span>{missions.filter(Boolean).length}/৪</span></div><div className="mission-list"><div className={missions[0] ? "done" : ""}><span>{missions[0] ? "✓" : "01"}</span><p><b>কাস্টমার খুশি</b><small>২টি অর্ডার সফলভাবে সার্ভ করুন</small></p></div><div className={servedCount >= 3 ? "done" : ""}><span>{servedCount >= 3 ? "✓" : "02"}</span><p><b>ব্যস্ত দোকানদার</b><small>৩টি আইটেম পরিবেশন করুন</small></p></div><div className={missions[2] ? "done" : ""}><span>{missions[2] ? "✓" : "03"}</span><p><b>হিসাবের মাস্টার</b><small>ছোট্ট অংকের আর্কেড জিতুন</small></p><button onClick={runMiniGame}>খেলুন</button></div><div className={missions[3] ? "done" : ""}><span>{missions[3] ? "✓" : "★"}</span><p><b>বোনাস: দোকান গুছান</b><small>সব তিনটি চুলা একসাথে চালু করুন</small></p></div></div></section>
          <div className="dashboard-foot">মামা, বাকি পরে। আগে অর্ডার দেন! 😏</div>
        </aside>
      </div>
      <footer className="game-footer"><span>টংবাজ · প্রোটোটাইপ</span><span>এটি লোকাল প্র্যাকটিস। অনলাইন মাল্টিপ্লেয়ার এখনো সংযুক্ত নয়।</span><span>চা ঠান্ডা, মাথা গরম নয়!</span></footer>
      {toast && <div className="toast">{toast}</div>}
      {showMini && <div className="modal-backdrop"><div className="modal-card mini-modal"><button className="modal-close" onClick={() => setShowMini(false)}>×</button><span className="section-kicker">MINI ARCADE · QUICK MATH</span><h2>হিসাবের গোলমাল 🧮</h2>{miniWon ? <div className="mini-success">🎉 বাহ! অংকে আপনি দোকানদারের চেয়েও পাকা।</div> : <><p>{miniNumber} × ৩ = কত?</p><input type="number" value={miniAnswer} onChange={(e) => setMiniAnswer(e.target.value)} placeholder="উত্তর লিখুন"/><button className="primary-button full" onClick={submitMini}>জমা দিন</button></>}</div></div>}
    </main>
  );
}