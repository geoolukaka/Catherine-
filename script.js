(function () {
  'use strict';

  var PHONE = '254794372117';
  var PRICE = 180;

  function wa(text) {
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
  }
  function money(n) {
    return 'KSh ' + n.toLocaleString('en-KE');
  }

  /* WhatsApp buttons */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = wa(a.getAttribute('data-wa'));
  });

  /* Price calculator */
  var kg = document.getElementById('kg');
  var total = document.getElementById('total');
  var calcWa = document.getElementById('calcwa');
  function updateCalc() {
    var q = Math.max(0, parseInt(kg.value, 10) || 0);
    total.textContent = money(q * PRICE);
    calcWa.href = wa('Hello Catherine, I would like to order ' + q + ' kg of Mwea Pishori rice at KSh ' + PRICE + ' per kg (' + money(q * PRICE) + '). Please confirm delivery to: ___');
  }
  if (kg && total && calcWa) {
    kg.addEventListener('input', updateCalc);
    document.querySelectorAll('.chips button').forEach(function (b) {
      b.addEventListener('click', function () {
        kg.value = b.getAttribute('data-q');
        updateCalc();
      });
    });
    updateCalc();
  }

  /* Chat assistant (rule-based, runs fully in the browser) */
  var btn = document.getElementById('chatBtn');
  var box = document.getElementById('chat');
  var msgs = document.getElementById('msgs');
  var qr = document.getElementById('qr');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatInput');
  var closeBtn = document.getElementById('chatClose');
  if (!btn || !box) return;

  var CHIPS = ['Price', 'How to order', 'Delivery', 'Payment', 'Talk to Catherine'];

  var KB = [
    { k: ['price', 'cost', 'how much', 'per kg', 'rate', 'charge for rice', '180'],
      a: 'Our 100% pure Mwea Pishori rice costs KSh 180 per kg. Tell me how many kilograms you need, for example "50 kg", and I will work out the total.' },
    { k: ['order', 'buy', 'purchase', 'place an order', 'get rice', 'quote'],
      a: 'Ordering is simple. Message Catherine on WhatsApp with your quantity and location. We confirm your total and delivery charge, you pay in full, and we deliver.',
      wa: 'Hello Catherine, I would like to place an order for Mwea Pishori rice.' },
    { k: ['deliver', 'delivery', 'shipping', 'ship', 'transport', 'countrywide', 'nairobi', 'mombasa', 'kisumu', 'when will', 'how long', 'days', 'weekly', 'week'],
      a: 'We deliver countrywide. Deliveries happen once a week. Bulk-order clients can ask for a different delivery day and we will confirm what is possible. Delivery charges apply and depend on your location.',
      wa: 'Hello Catherine, I would like to know the delivery charge to: ___' },
    { k: ['pay', 'payment', 'mpesa', 'm-pesa', 'm pesa', 'credit', 'installment', 'deposit', 'cash', 'bank', 'paybill', 'till'],
      a: 'Full payment is required on all orders before delivery, and we do not offer credit. We share the payment details on WhatsApp when we confirm your order.' },
    { k: ['minimum', 'small', 'quantity', 'few kg', 'sample', 'smallest', 'how many'],
      a: 'We supply both small and large quantities, from a few kilograms for your home to bulk orders for hotels, restaurants, schools and shops.' },
    { k: ['bulk', 'wholesale', 'large order', 'discount', 'hotel', 'restaurant', 'school', 'shop', 'business', 'caterer'],
      a: 'Bulk orders are welcome. The price is KSh 180 per kg. Send your volume and location on WhatsApp and Catherine will confirm your total and delivery. Bulk clients can also ask for a different delivery arrangement.',
      wa: 'Hello Catherine, I run a business and would like a bulk quote for Mwea Pishori rice.' },
    { k: ['pure', 'mixed', 'mixing', 'quality', 'real', 'genuine', 'fake', 'origin', 'source', 'where', 'mwea', 'pishori', 'farm'],
      a: 'Our rice is 100% pure Mwea Pishori, sourced directly from Mwea, with no mixing. Catherine is a farmer and has supplied more than 1,600 kg in the last five months.' },
    { k: ['terms', 'conditions', 'policy', 'refund', 'return', 'complain', 'problem', 'damaged'],
      a: 'Our terms are at the bottom of this page. In short: full payment before delivery, no credit, weekly deliveries, and delivery charges depend on your location. If something is not right with your order, message Catherine on WhatsApp straight away.',
      link: ['#terms', 'Read the terms'] },
    { k: ['contact', 'phone', 'number', 'call', 'email', 'whatsapp', 'reach', 'speak', 'talk', 'human', 'person', 'catherine', 'agent', 'help'],
      a: 'You can reach Catherine on WhatsApp at +254 794 372 117 or by email at mainakate7@gmail.com.',
      wa: 'Hello Catherine, I have a question about your rice.' },
    { k: ['who', 'about', 'story', 'owner', 'maina'],
      a: 'Maina’s Pishori is run by Catherine Maina, a farmer who supplies pure Mwea Pishori rice. Our values are trust, consistency and care.' },
    { k: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'habari', 'jambo'],
      a: 'Hello, and welcome to Maina’s Pishori. How can I help you today?' },
    { k: ['thank', 'thanks', 'asante'],
      a: 'You are welcome. When you are ready to order, message Catherine on WhatsApp.',
      wa: 'Hello Catherine, I would like to place an order for Mwea Pishori rice.' }
  ];

  var FALLBACK = 'I am not sure about that one, but Catherine can answer it directly on WhatsApp.';

  function addMsg(text, who, extra) {
    var d = document.createElement('div');
    d.className = 'm ' + who;
    d.textContent = text;
    if (extra && extra.wa) {
      var a = document.createElement('a');
      a.className = 'wa';
      a.href = wa(extra.wa);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Chat on WhatsApp';
      d.appendChild(document.createElement('br'));
      d.appendChild(a);
    }
    if (extra && extra.link) {
      var l = document.createElement('a');
      l.className = 'wa';
      l.href = extra.link[0];
      l.textContent = extra.link[1];
      l.addEventListener('click', function () { setOpen(false); });
      d.appendChild(document.createElement('br'));
      d.appendChild(l);
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function reply(raw) {
    var t = raw.toLowerCase().replace(/[^a-z0-9\s'.,-]/g, ' ');
    var m = t.match(/(\d[\d,]*)\s*(kg|kgs|kilo|kilos|kilogram|kilograms)\b/);
    if (m) {
      var q = parseInt(m[1].replace(/,/g, ''), 10);
      if (q > 0) {
        var sum = q * PRICE;
        addMsg(q.toLocaleString('en-KE') + ' kg of Mwea Pishori at KSh ' + PRICE + ' per kg comes to ' + money(sum) + ', before delivery. Delivery charges depend on your location, and full payment is made before delivery.', 'bot',
          { wa: 'Hello Catherine, I would like to order ' + q + ' kg of Mwea Pishori rice (' + money(sum) + '). Please confirm delivery to: ___' });
        return;
      }
    }
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var s = 0;
      item.k.forEach(function (key) {
        var re = new RegExp('(^|\\s)' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        if (re.test(t)) s += key.indexOf(' ') > -1 ? 2 : 1;
      });
      if (s > bestScore) { bestScore = s; best = item; }
    });
    if (best) addMsg(best.a, 'bot', { wa: best.wa, link: best.link });
    else addMsg(FALLBACK, 'bot', { wa: 'Hello Catherine, I have a question: ' + raw.slice(0, 120) });
  }

  function chips() {
    qr.textContent = '';
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c;
      b.addEventListener('click', function () { send(c === 'Talk to Catherine' ? 'talk to Catherine' : c); });
      qr.appendChild(b);
    });
  }

  function send(text) {
    text = (text || '').trim();
    if (!text) return;
    addMsg(text, 'me');
    setTimeout(function () { reply(text); }, 350);
  }

  var started = false;
  function setOpen(open) {
    box.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (!started) {
        started = true;
        addMsg('Hello, I am the Maina’s Pishori assistant. Ask me about price, delivery, payment or how to order, or type a quantity like "50 kg" to get a total.', 'bot');
        chips();
      }
      input.focus();
    } else {
      btn.focus();
    }
  }

  btn.addEventListener('click', function () { setOpen(!box.classList.contains('open')); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) setOpen(false);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    send(v);
  });
})();
