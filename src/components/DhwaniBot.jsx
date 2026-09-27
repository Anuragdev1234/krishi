import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Globe
} from 'lucide-react';

export default function DhwaniBot({ t, lang = 'hi', setLang }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  // botLanguage can be 'hi', 'en', or 'pa'
  const [botLang, setBotLang] = useState(lang);
  const messagesEndRef = useRef(null);

  // Sync with global language if changed from top bar
  useEffect(() => {
    if (lang && lang !== botLang) {
      setBotLang(lang);
    }
  }, [lang]);

  const getGreeting = (selectedLanguage) => {
    if (selectedLanguage === 'hi') {
      return {
        sender: 'bot',
        text: "नमस्ते! 🙏 मैं ध्वनि हूँ, स्मार्ट कृषि अधिप्राप्ति कतार प्रबंधन पोर्टल की एआई डिजिटल सहायक।\n\nमैं आपकी क्या सहायता कर सकती हूँ? आप निम्नलिखित से संबंधित प्रश्न पूछ सकते हैं:\n• किसान पंजीकरण एवं भूलेख खसरा सत्यापन प्रक्रिया\n• मंडी स्लॉट और निश्चित समय बुकिंग\n• बिना स्मार्टफोन वाले किसानों हेतु SMS व 166/51969 सुविधा\n• फसल सैंपल फोटो अपलोड व कृषि निरीक्षक जांच\n• खरीद स्थिति ट्रैकिंग व सीधे बैंक खाते में DBT भुगतान\n• मंडी ऑपरेटर व रसद परिवहन प्रबंधन\n• खरीफ 2026-27 न्यूनतम समर्थन मूल्य (MSP) दरें",
        time: 'Just now',
        steps: null,
        navPath: null
      };
    } else if (selectedLanguage === 'pa') {
      return {
        sender: 'bot',
        text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਧਵਨੀ ਹਾਂ, ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਖਰੀਦ ਪੋਰਟਲ ਦੀ ਡਿਜੀਟਲ ਸਹਾਇਕ।\n\nਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ? ਤੁਸੀਂ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n• ਕਿਸਾਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ\n• ਮੰਡੀ ਸਲਾਟ ਅਤੇ ਸਮਾਂ ਬੁਕਿੰਗ\n• ਸਾਦੇ ਕੀਪੈਡ ਫੋਨਾਂ ਲਈ SMS ਸੁਵਿਧਾ (166 / 51969)\n• ਫ਼ਸਲ ਨਮੂਨਾ ਫੋਟੋ ਅਤੇ ਨਿਰੀਖਕ ਜਾਂਚ\n• ਖਰੀਦ ਸਥਿਤੀ ਅਤੇ ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ (DBT)\n• ਐਮ.ਐਸ.ਪੀ (MSP) ਭਾਅ 2026-27",
        time: 'Just now',
        steps: null,
        navPath: null
      };
    } else {
      return {
        sender: 'bot',
        text: "Namaste! 🙏 I am Dhwani, your AI assistant for the Smart Agricultural Procurement Queue Management Platform.\n\nHow can I help you today? You can ask about:\n• Step-by-step Farmer Registration & Bhulekh Land Sync\n• Booking Mandi Appointment Slots & Digital Tokens\n• SMS facility for keypad feature phones (Pull-SMS 166)\n• Mandatory Pre-Mandi Crop Sample Photo & Assayer Review\n• Tracking 5-Stage Procurement & DBT Bank Payouts\n• Mandi Operator & Logistics Admin Consoles\n• Current 2026-27 Kharif MSP Rates",
        time: 'Just now',
        steps: null,
        navPath: null
      };
    }
  };

  const [messages, setMessages] = useState([getGreeting(botLang)]);
  const [inputVal, setInputVal] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle explicit language switch
  const switchLanguage = (newLang, notifyMsg = null) => {
    setBotLang(newLang);
    if (setLang) setLang(newLang);
    const notification = notifyMsg || (
      newLang === 'hi' 
        ? "भाषा बदलकर हिन्दी कर दी गई है। अब आप हिन्दी में कोई भी सवाल पूछ सकते हैं। आप क्या जानना चाहते हैं?"
        : newLang === 'pa'
        ? "ਭਾਸ਼ਾ ਬਦਲ ਕੇ ਪੰਜਾਬੀ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ। ਹੁਣ ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"
        : "Language switched to English. You can now continue your queries in English. How may I assist you?"
    );
    return notification;
  };

  // Restart new conversation session
  const handleRestartSession = () => {
    setMessages([getGreeting(botLang)]);
    setSessionEnded(false);
    setInputVal('');
  };

  // Versatile AI Dialogue Intelligence Engine
  const processQuery = (rawText, currentBotLanguage) => {
    const text = rawText.trim().toLowerCase();

    // 0. Language Switch & Linguistic Format Intelligence
    // Explicit switch commands
    const isExplicitHindiReq = 
      text.includes('hindi') || 
      text.includes('हिंदी') || 
      text.includes('हिन्दी') || 
      text.includes('say in hindi') || 
      text.includes('speak in hindi') || 
      text.includes('talk in hindi') || 
      text.includes('reply in hindi') || 
      text.includes('in hindi') || 
      text.includes('hindi please') ||
      text.includes('hindi mai bolo') ||
      text.includes('hindi me bolo') ||
      text.includes('hindi mein bolo') ||
      text.includes('hindi me batao') ||
      text.includes('hindi me bataye') ||
      text.includes('hindi format') ||
      text.includes('hindi bhasha');

    const isPunjabiReq = 
      text.includes('punjabi') || 
      text.includes('ਪੰਜਾਬੀ') || 
      text.includes('punjabi vich') || 
      text.includes('punjabi me') || 
      text.includes('speak in punjabi');

    const isExplicitEnglishReq = 
      text.includes('english') || 
      text.includes('अंग्रेजी') || 
      text.includes('in english') || 
      text.includes('speak in english') || 
      text.includes('talk in english') || 
      text.includes('reply in english') || 
      text.includes('english please') ||
      text.includes('english me') ||
      text.includes('english format');

    // Devanagari script detection
    const isDevanagari = /[\u0900-\u097F]/.test(rawText);

    // Hindi words written in English letters / Hinglish format ("words in english format")
    const hinglishRegex = /\b(kaise|karna|kare|karein|karen|karo|kijiye|kya|kyun|kaha|kahan|kab|kitna|kitni|batao|bataye|bataiye|samjhao|samjha|madad|sahayata|sahayta|chahiye|chahta|chahte|kisan|kisano|fasal|faslo|khet|kheti|dhan|gehu|gehun|makka|sarson|mandi|mandiyo|bhav|daam|mulya|dar|paise|paisa|khata|rupiya|rupaye|nami|dharmkanta|tolaai|tulai|parchi|sawal|prashna|jankari|mera|meri|mere|apna|apne|apni|humara|hamara|namaste|namaskar|pranam|ram ram|dhanyawad|shukriya|alvida|bina|saada|chhota|nahi|nahin|hoga|hogi|hote|hoti|aayega|aayenge|puchna|pucho|boliye|bolo|shuru|kripya|kripa)\b/i;
    const isHinglish = hinglishRegex.test(text);

    // Determine target language and if a switch is triggered
    let activeLang = currentBotLanguage || botLang;
    let switchedNotice = null;
    let newLanguageTriggered = null;

    if (isExplicitHindiReq || isDevanagari || isHinglish) {
      if (activeLang !== 'hi') {
        switchLanguage('hi');
        activeLang = 'hi';
        newLanguageTriggered = 'hi';
        switchedNotice = "🔔 *बातचीत की भाषा बदलकर हिन्दी कर दी गई है (Conversation language switched to Hindi)*\n\n";
      }
    } else if (isPunjabiReq) {
      if (activeLang !== 'pa') {
        switchLanguage('pa');
        activeLang = 'pa';
        newLanguageTriggered = 'pa';
        switchedNotice = "🔔 *ਗੱਲਬਾਤ ਦੀ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ (Switched to Punjabi)*\n\n";
      }
    } else if (isExplicitEnglishReq) {
      if (activeLang !== 'en') {
        switchLanguage('en');
        activeLang = 'en';
        newLanguageTriggered = 'en';
        switchedNotice = "🔔 *Conversation language switched to English (बातचीत की भाषा अंग्रेजी कर दी गई है)*\n\n";
      }
    }

    // Pure language switch requests without any further question
    const isPureHindiSwitch = isExplicitHindiReq && (
      text === 'hindi' || 
      text === 'हिंदी' || 
      text === 'हिन्दी' || 
      text === 'hindi me' || 
      text === 'hindi mein' || 
      text === 'talk in hindi' || 
      text === 'speak in hindi' || 
      text === 'say in hindi' || 
      text === 'in hindi' || 
      text === 'hindi please' || 
      text === 'hindi me bolo' || 
      text === 'hindi mein bolo' ||
      text === 'hindi me baat karo' ||
      text === 'hindi format'
    );

    const isPurePunjabiSwitch = isPunjabiReq && (
      text === 'punjabi' || 
      text === 'ਪੰਜਾਬੀ' || 
      text === 'speak in punjabi' || 
      text === 'punjabi please'
    );

    const isPureEnglishSwitch = isExplicitEnglishReq && (
      text === 'english' || 
      text === 'in english' || 
      text === 'speak in english' || 
      text === 'say in english' || 
      text === 'talk in english' || 
      text === 'english please' || 
      text === 'english format' || 
      text === 'अंग्रेजी'
    );

    if (isPureHindiSwitch) {
      return {
        reply: "बातचीत की भाषा बदलकर हिन्दी कर दी गई है। 🙏 नमस्ते! अब हमारी बातचीत हिन्दी में होगी।\n\nआप पोर्टल के बारे में क्या जानना चाहते हैं? आप निम्नलिखित विषयों पर सवाल पूछ सकते हैं:\n• किसान पंजीकरण और भूलेख सत्यापन\n• मंडी स्लॉट और डिजिटल टोकन बुकिंग\n• बिना स्मार्टफोन वाले किसानों हेतु SMS सुविधा\n• फसल सैंपल फोटो अपलोड व निरीक्षक जांच\n• खरीद स्थिति ट्रैकिंग व सीधे बैंक खाते में भुगतान (DBT)\n• 2026-27 न्यूनतम समर्थन मूल्य (MSP) दरें",
        newLang: 'hi',
        quickOptions: ["पंजीकरण कैसे करें?", "स्लॉट कैसे बुक करें?", "न्यूनतम समर्थन मूल्य (MSP)", "सादा फोन SMS सुविधा"]
      };
    }

    if (isPurePunjabiSwitch) {
      return {
        reply: "ਗੱਲਬਾਤ ਦੀ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ। 🙏 ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਹੁਣ ਸਾਡੀ ਗੱਲਬਾਤ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋਵੇਗੀ।\n\nਤੁਸੀਂ ਪੋਰਟਲ ਬਾਰੇ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
        newLang: 'pa',
        quickOptions: ["ਕਿਸਾਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ", "ਮੰਡੀ ਸਲਾਟ ਬੁਕਿੰਗ", "ਐਮ.ਐਸ.ਪੀ ਭਾਅ", "ਕੀਪੈਡ ਫੋਨ SMS"]
      };
    }

    if (isPureEnglishSwitch) {
      return {
        reply: "Conversation language has been switched to English. 🙏 Namaste! You can now explore all portal features in English.\n\nHow can I help you today? Feel free to ask about:\n• Step-by-step Farmer Registration\n• Mandi Slot & Token Booking\n• Basic keypad phone SMS facilities\n• Crop sample photo assayer review\n• Tracking procurement & DBT bank transfer\n• Current 2026-27 MSP Rates",
        newLang: 'en',
        quickOptions: ["How to register?", "How to book slot?", "MSP Rates 2026-27", "No smartphone facility"]
      };
    }

    // Helper to prepend switch notice if language changed in this turn
    const formatReply = (textReply) => {
      return switchedNotice ? `${switchedNotice}${textReply}` : textReply;
    };

    // 1. Session Ending or Gratitude
    if (
      text.includes('thank') || 
      text.includes('dhanyawad') || 
      text.includes('shukriya') || 
      text.includes('धन्यवाद') || 
      text.includes('शुक्रिया') || 
      text.includes('ਧੰਨਵਾਦ') ||
      text === 'bye' || 
      text === 'goodbye' || 
      text === 'ok bye' ||
      text.includes('solved') ||
      text.includes('no more') ||
      text.includes('that is all') ||
      text.includes('all good') ||
      text.includes('ho gaya') ||
      text.includes('samajh aa gaya') ||
      text.includes('kuch nahi')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("आपका बहुत-बहुत धन्यवाद! मुझे खुशी है कि मैं आपके सभी सवालों का समाधान कर सकी। 🙏\n\nआपका सहायता सत्र अब समाप्त हो गया है। आपकी फसल अच्छी हो और आपको पूरा समर्थन मूल्य मिले। जय किसान! 🌾"),
          newLang: newLanguageTriggered,
          endSession: true
        };
      } else if (activeLang === 'pa') {
        return {
          reply: formatReply("ਤੁਹਾਡਾ ਬਹੁਤ ਧੰਨਵਾਦ! ਖੁਸ਼ੀ ਹੋਈ ਕਿ ਤੁਹਾਡੀ ਸਮੱਸਿਆ ਹੱਲ ਹੋ ਗਈ। 🙏\n\nਤੁਹਾਡਾ ਸਹਾਇਤਾ ਸੈਸ਼ਨ ਸਮਾਪਤ ਹੋ ਗਿਆ ਹੈ। ਜੈ ਕਿਸਾਨ! 🌾"),
          newLang: newLanguageTriggered,
          endSession: true
        };
      } else {
        return {
          reply: formatReply("You're most welcome! Glad I could resolve your queries regarding our Agricultural Procurement Platform. 🙏\n\nYour support session is now completed. Wishing you a bountiful and prosperous harvest season! Jai Kisan! 🌾"),
          newLang: newLanguageTriggered,
          endSession: true
        };
      }
    }

    // 2. Greetings
    if (
      text === 'hi' || 
      text === 'hello' || 
      text === 'hey' || 
      text.includes('namaste') || 
      text.includes('namaskar') || 
      text.includes('sat sri akal') || 
      text.includes('नमस्ते') || 
      text.includes('नमस्कार') ||
      text.includes('सत श्री अकाल') ||
      text.includes('good morning') ||
      text.includes('good afternoon') ||
      text.includes('good evening') ||
      text.includes('ram ram') ||
      text.includes('राम राम') ||
      text.includes('pranam') ||
      text.includes('प्रणाम')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("नमस्ते! 🙏 उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय के पोर्टल पर आपका स्वागत है।\n\nक्या आपको पोर्टल से संबंधित कोई सवाल पूछना है? कृपया बताएं कि आप पंजीकरण, मंडी स्लॉट बुकिंग, फसल गुणवत्ता या बैंक भुगतान में से क्या जानना चाहते हैं?"),
          newLang: newLanguageTriggered,
          quickOptions: ["पंजीकरण कैसे करें?", "स्लॉट कैसे बुक करें?", "न्यूनतम समर्थन मूल्य (MSP)", "सादा फोन SMS सुविधा"]
        };
      } else if (activeLang === 'pa') {
        return {
          reply: formatReply("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਖੁਰਾਕ ਅਤੇ ਜਨਤਕ ਵੰਡ ਮੰਤਰਾਲੇ ਦੇ ਪੋਰਟਲ 'ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ।\n\nਕੀ ਤੁਹਾਡਾ ਕੋਈ ਸਵਾਲ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਮੰਡੀ ਸਲਾਟ ਬੁਕਿੰਗ ਜਾਂ ਐਮ.ਐਸ.ਪੀ ਭੁਗਤਾਨ ਬਾਰੇ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"),
          newLang: newLanguageTriggered,
          quickOptions: ["ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰੀਏ?", "ਸਲਾਟ ਬੁਕਿੰਗ ਕਿਵੇਂ ਕਰੀਏ?", "ਐਮ.ਐਸ.ਪੀ ਦਰਾਂ", "ਕੀਪੈਡ ਫੋਨ SMS"]
        };
      } else {
        return {
          reply: formatReply("Namaste! 🙏 Warm greetings from the Ministry of Consumer Affairs, Food & Public Distribution.\n\nDo you have any queries regarding our procurement platform? Please feel free to ask about farmer registration, booking mandi slots, crop quality checks, or tracking your payment."),
          newLang: newLanguageTriggered,
          quickOptions: ["How to register?", "How to book slot?", "MSP Rates 2026-27", "No smartphone facility"]
        };
      }
    }

    // 3. User confirming they have queries ("yes", "i have query", "help me", "ha", "puchna hai")
    if (
      text === 'yes' || 
      text === 'ha' || 
      text === 'haan' || 
      text === 'हाँ' || 
      text === 'हां' || 
      text === 'ji' ||
      text === 'jee' ||
      text === 'जी' ||
      text.includes('have question') || 
      text.includes('help me') ||
      text.includes('need help') ||
      text.includes('kuch puchna hai') ||
      text.includes('sawal hai') ||
      text.includes('bataye') ||
      text.includes('batao')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("बिल्कुल! आपका सवाल किससे संबंधित है? कृपया बताएं:\n1. 📝 किसान पंजीकरण और भूलेख खसरा सत्यापन\n2. 📅 मंडी में खरीद समय और स्लॉट बुकिंग\n3. 📱 बिना इंटरनेट/सादे कीपैड फोन हेतु SMS 166 सुविधा\n4. 📷 फसल का फोटो अपलोड व कृषि निरीक्षक जांच\n5. 💰 न्यूनतम समर्थन मूल्य (MSP) और सीधे बैंक खाते में DBT भुगतान\n6. 🏢 मंडी ऑपरेटर व धर्मकांटा कार्यप्रणाली\n\nमैं आपको पूरी क्रमवार जानकारी दूंगी!"),
          newLang: newLanguageTriggered,
          quickOptions: ["पंजीकरण प्रक्रिया", "स्लॉट बुकिंग प्रक्रिया", "सादा फोन SMS", "फसल सैंपल जांच", "DBT बैंक भुगतान"]
        };
      } else {
        return {
          reply: formatReply("Certainly! What is your query regarding? Please specify if it is related to:\n1. 📝 Farmer Registration & Land Records\n2. 📅 Slot & Time Booking at your local Mandi\n3. 📱 Offline SMS & Keypad phone facility\n4. 📷 Pre-mandi crop sample photo inspection\n5. 💰 Minimum Support Price (MSP) or DBT Bank transfer\n6. 🏢 Mandi Operator & Administrative actions\n\nI will provide you with full step-by-step instructions!"),
          newLang: newLanguageTriggered,
          quickOptions: ["Registration Steps", "Slot Booking Steps", "Offline SMS steps", "Assayer Check", "DBT Payment"]
        };
      }
    }

    // 4. Detailed: FARMER REGISTRATION
    if (
      text.includes('register') || 
      text.includes('registration') || 
      text.includes('पंजीकरण') || 
      text.includes('रजिस्ट्रेशन') || 
      text.includes('रजिस्टर') ||
      text.includes('signup') ||
      text.includes('login') ||
      text.includes('panjikaran') ||
      text.includes('bhulekh') ||
      text.includes('khasra') ||
      text.includes('khatauni')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("किसान पंजीकरण एवं भूलेख खसरा सत्यापन की पूरी क्रमवार (Step-by-step) प्रक्रिया:"),
          newLang: newLanguageTriggered,
          steps: [
            "ऊपर मेन्यू से 'किसान पंजीकरण' (/register) पेज खोलें।",
            "अपना 10-अंकों का आधार से जुड़ा मोबाइल नंबर दर्ज करें और 'ओटीपी भेजें' पर क्लिक करें। (आप दाईं ओर दी गई 35+ पहले से सत्यापित किसानों की सूची में से किसी को भी चुन सकते हैं)।",
            "C-DAC मोबाइल सेवा द्वारा भेजा गया 6-अंकों का ओटीपी (डेमो ओटीपी: 123456) दर्ज करके 'सत्यापित करें' पर क्लिक करें।",
            "सिस्टम राज्य के भूलेख/भू-नक्शा रिकॉर्ड से आपके खसरा नंबर, खेती का रकबा (हेक्टेयर) और अधिकतम खरीद योग्य मात्रा स्वतः जांच लेगा।",
            "अपने आधार-लिंक्ड बैंक खाते की पुष्टि करें और 'मंडी स्लॉट बुक करने के लिए आगे बढ़ें' पर क्लिक करें।"
          ],
          navPath: '/register',
          navText: "किसान पंजीकरण पेज पर जाएं"
        };
      } else {
        return {
          reply: formatReply("Here are the complete step-by-step instructions for Farmer Registration & Bhulekh Land Sync on this portal:"),
          newLang: newLanguageTriggered,
          steps: [
            "Navigate to the 'Farmer Registration' page (/register) from the top menu.",
            "Enter your 10-digit Aadhaar-linked mobile number and click 'Generate OTP'. (You can also pick from the pre-verified 35+ farmer directory on the right for instant login).",
            "Enter the 6-digit OTP received via C-DAC Mobile Seva (Demo OTP: 123456) and click 'Verify & Proceed'.",
            "The system will automatically cross-reference state Bhulekh/BhuNaksha registries to retrieve your Khasra/Survey numbers, verified land area, and calculate your maximum permissible crop yield.",
            "Review your Aadhaar-seeded bank account details for direct payment and click 'Proceed to Book Mandi Slot'."
          ],
          navPath: '/register',
          navText: "Go to Farmer Registration Page"
        };
      }
    }

    // 5. Detailed: SLOT BOOKING & TIME
    if (
      text.includes('slot') || 
      text.includes('booking') || 
      text.includes('appointment') || 
      text.includes('time') || 
      text.includes('तारीख') || 
      text.includes('स्लॉट') || 
      text.includes('बुकिंग') ||
      text.includes('टोकन') ||
      text.includes('token') ||
      text.includes('din') ||
      text.includes('samay') ||
      text.includes('tarikh') ||
      text.includes('taareekh') ||
      text.includes('waqt') ||
      text.includes('kab aana')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("मंडी में फसल बिक्री हेतु स्लॉट व डिजिटल टोकन बुक करने की क्रमवार प्रक्रिया:"),
          newLang: newLanguageTriggered,
          steps: [
            "'स्लॉट बुकिंग' (/booking) पेज खोलें।",
            "चरण 1 - मंडी चुनें: अपनी निकटतम खरीद मंडी (जैसे लखनऊ दुबग्गा, खन्ना मंडी, भोपाल करोंद, करनाल, संबलपुर, रायपुर) चुनें।",
            "चरण 2 - फसल और वजन: अपनी फसल (धान, सोयाबीन, गेहूं, मक्का) चुनें और अनुमानित वजन (मीट्रिक टन) दर्ज करें।",
            "चरण 3 - सैंपल फोटो: मंडी जाने से पूर्व अपनी फसल के दाने का फोटो अपलोड करें जिसे सरकारी कृषि निरीक्षक चेक करेगा।",
            "चरण 4 - तारीख व समय: अपनी सुविधा अनुसार तारीख और उपलब्ध 1 घंटे का समय स्लॉट (उदा. 10:00 AM - 11:00 AM) चुनें।",
            "चरण 5 - फोन प्रकार: यदि स्मार्टफोन है तो 'स्मार्टफोन' चुनें (क्यूआर कोड मिलेगा); यदि सादा फोन है तो 'बेसिक फीचर फोन' चुनें (SMS टोकन मिलेगा)।",
            "चरण 6 - वाहन: वाहन का प्रकार (ट्रैक्टर ट्रॉली, पिकअप, ट्रक) और गाड़ी नंबर दर्ज करें।",
            "'पुष्टि करें और टोकन प्राप्त करें' पर क्लिक करें। आपका डिजिटल ई-टोकन (उदा. TK-UP-2026-XXXX) कतार नंबर और संभावित प्रतीक्षा समय सहित तुरंत जनरेट हो जाएगा।"
          ],
          navPath: '/booking',
          navText: "स्लॉट बुकिंग पेज पर जाएं"
        };
      } else {
        return {
          reply: formatReply("Here is the step-by-step procedure to book an algorithmic procurement slot at your nearby mandi:"),
          newLang: newLanguageTriggered,
          steps: [
            "Open the 'Slot Booking' page (/booking).",
            "Step 1 - Select Mandi: Choose your procurement center (e.g., Lucknow Dubagga, Khanna Grain Market, Bhopal, Karnal, Sambalpur, Raipur). The card shows live capacity and average wait time.",
            "Step 2 - Crop & Tonnage: Select your commodity (Paddy, Soybean, Wheat, Maize) and enter your estimated tonnage in Metric Tonnes.",
            "Step 3 - Sample Photo: Upload a photo of your grain sample for pre-mandi review by your assigned agronomy inspector.",
            "Step 4 - Time Window: Pick an hourly slot (e.g. 10:00 AM - 11:00 AM) that has available vehicle quotas.",
            "Step 5 - Device Selection: Choose 'Smartphone' for digital QR token or 'Basic Feature Phone' for SMS pass.",
            "Step 6 - Vehicle Details: Choose vehicle type (Tractor Trolley, Truck, Bullock Cart) and enter your registration number.",
            "Click 'Confirm & Generate Token'. Your official E-Token (e.g. TK-UP-2026-XXXX) with queue position and Estimated Waiting Time (EWT) is generated instantly."
          ],
          navPath: '/booking',
          navText: "Go to Slot Booking Page"
        };
      }
    }

    // 6. Detailed: OFFLINE / BASIC KEYPAD PHONE / NO INTERNET
    if (
      text.includes('smartphone') || 
      text.includes('phone') || 
      text.includes('keypad') || 
      text.includes('sms') || 
      text.includes('offline') || 
      text.includes('feature phone') || 
      text.includes('छोटा फोन') || 
      text.includes('सादा फोन') ||
      text.includes('कीपैड') ||
      text.includes('मोबाइल नहीं') ||
      text.includes('166') ||
      text.includes('51969') ||
      text.includes('saada phone') ||
      text.includes('chhota phone') ||
      text.includes('bina internet') ||
      text.includes('bina smartphone')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("जिन किसानों के पास स्मार्टफोन या इंटरनेट नहीं है, उनके लिए पूरी तरह निःशुल्क ऑफलाइन SMS सुविधा:"),
          newLang: newLanguageTriggered,
          steps: [
            "स्लॉट बुक करते समय 'बेसिक फीचर फोन (बिना इंटरनेट)' विकल्प चुनें।",
            "सिस्टम आपके सामान्य फोन पर सरकारी C-DAC मोबाइल सेवा MSDG द्वारा 6-अंकों का SMS टोकन पास भेजेगा।",
            "निःशुल्क पुल-एसएमएस (Pull-SMS) जांच: आप बिना इंटरनेट वाले किसी भी सामान्य कीपैड फोन से कभी भी अपनी कतार और स्थिति जान सकते हैं।",
            "طریقہ: अपने फोन से लिखें: 'KHARIF STATUS <टोकन_नंबर>' और इसे 166 या 51969 पर भेज दें।",
            "सरकारी गेटवे तुरंत आपको आपकी वर्तमान कतार स्थिति और संभावित प्रतीक्षा समय का रिप्लाई भेजेगा।",
            "गांव के कॉमन सर्विस सेंटर (CSC) या मंडी हेल्पडेस्क से आप अपनी पर्ची का प्रिंट भी निकलवा सकते हैं।"
          ],
          navPath: '/booking',
          navText: "सादा फोन SMS बुकिंग देखें"
        };
      } else {
        return {
          reply: formatReply("Our platform provides full offline equality for farmers who do not own a smartphone or lack internet connectivity:"),
          newLang: newLanguageTriggered,
          steps: [
            "During slot booking, select the 'Basic Feature Phone (No Internet)' option.",
            "The system will issue a 6-digit numeric SMS pass directly to your mobile via the government C-DAC Mobile Seva MSDG gateway.",
            "Free Pull-SMS Inquiries: You can check your live queue status anytime from any simple keypad phone without internet by sending an SMS:",
            "Format: SMS 'KHARIF STATUS <TOKEN>' to shortcode 166 or 51969.",
            "The national gateway will instantly reply with your current queue position and estimated wait time.",
            "Common Service Centers (CSCs) and Mandi Helpdesks can also print your physical slip free of charge."
          ],
          navPath: '/booking',
          navText: "View Feature Phone SMS Booking"
        };
      }
    }

    // 7. Detailed: PRE-MANDI CROP SAMPLE PHOTO & ASSAYER REVIEW
    if (
      text.includes('sample') || 
      text.includes('photo') || 
      text.includes('image') || 
      text.includes('inspector') || 
      text.includes('assayer') || 
      text.includes('moisture') || 
      text.includes('नमी') || 
      text.includes('फोटो') || 
      text.includes('जांच') ||
      text.includes('सैंपल') ||
      text.includes('निरीक्षक') ||
      text.includes('quality') ||
      text.includes('reject') ||
      text.includes('dana') ||
      text.includes('daana') ||
      text.includes('sukha')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("फसल सैंपल फोटो सत्यापन एवं मंडी से पूर्व गुणवत्ता जांच (Pre-Mandi Inspection):"),
          newLang: newLanguageTriggered,
          steps: [
            "उद्देश्य: पहले कई बार किसान मंडी पहुंचने के बाद नमी या कचरे के बहाने उपज खारिज होने या कटौती से परेशान होते थे।",
            "फोटो अपलोड: बुकिंग के दौरान किसान अपनी साफ फसल के दाने का फोटो अपलोड करते हैं।",
            "सरकारी निरीक्षक आवंटन: सिस्टम हर किसान को एक प्रमाणित सरकारी कृषि गुणवत्ता परीक्षक (जैसे इंजी. अनिल स्वरूप #842) आवंटित करता है।",
            "मानक नमी दर: धान के लिए सरकारी स्वीकार्य नमी 17.0% या उससे कम होनी चाहिए। यदि नमी अधिक है तो निरीक्षक किसान को पहले ही 1 दिन धूप में सुखाने की सलाह देता है।",
            "न्यूनतम समर्थन मूल्य (MSP) गारंटी: निरीक्षक की प्रारंभिक स्वीकृति के बाद आपका पूरा सरकारी समर्थन मूल्य सुरक्षित हो जाता है, जिससे मंडी गेट पर बिचौलियों का शोषण बंद होता है।"
          ],
          navPath: '/booking',
          navText: "फसल सैंपल फोटो अपलोड करें"
        };
      } else {
        return {
          reply: formatReply("Here is how our Pre-Mandi Crop Sample Inspection & Price Guarantee works:"),
          newLang: newLanguageTriggered,
          steps: [
            "Purpose: In traditional mandis, farmers often face gate rejection or unfair price cuts after traveling long distances due to high moisture or impurities.",
            "Photo Upload: During booking, farmers upload a photo of their grain sample and note drying conditions.",
            "Certified Inspector Assignment: The system assigns a certified government agronomy assayer (e.g. Er. Anil Swarup #842) who assesses the visual sample.",
            "Statutory Moisture Standard: Permissible moisture level is 17.0% or below for Paddy. If moisture is borderline, the inspector advises extra sun drying before travel.",
            "Full MSP Price Lock: Once pre-approved, your entitlement to the notified Minimum Support Price is locked, eliminating intermediary exploitation at the mandi gate."
          ],
          navPath: '/booking',
          navText: "Upload Crop Sample in Booking"
        };
      }
    }

    // 8. Detailed: TRACKING PROCUREMENT & PAYMENT (DBT)
    if (
      text.includes('track') || 
      text.includes('status') || 
      text.includes('payment') || 
      text.includes('dbt') || 
      text.includes('money') || 
      text.includes('rupee') || 
      text.includes('पैसा') || 
      text.includes('भुगतान') || 
      text.includes('स्थिति') ||
      text.includes('खाता') ||
      text.includes('pfms') ||
      text.includes('utr') ||
      text.includes('paisa') ||
      text.includes('paise') ||
      text.includes('khate me') ||
      text.includes('bank') ||
      text.includes('kab aayega')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("अपनी फसल खरीद व बैंक खाते में भुगतान ट्रैक करने की प्रक्रिया:"),
          newLang: newLanguageTriggered,
          steps: [
            "'खरीद की स्थिति देखें' (/track) पेज पर जाएं।",
            "अपना टोकन नंबर (उदा. TK-UP-2026-0001) या मोबाइल नंबर दर्ज करें (या नीचे दिए गए लाइव टोकन पर क्लिक करें)।",
            "5-चरणीय प्रगति देखें:",
            "  1. स्लॉट निर्धारित ➔ टोकन जनरेट व मंडी कोटा आरक्षित।",
            "  2. मंडी आगमन ➔ गेट पर क्यूआर कोड स्कैन और कतार में प्रवेश।",
            "  3. गुणवत्ता व नमी जांच ➔ डिजिटल सेंसर द्वारा नमी परीक्षण (≤ 17.0%)।",
            "  4. धर्मकांटा तुलाई ➔ भरे वाहन और खाली वाहन के वजन का अंतर (शुद्ध वजन)।",
            "  5. डीबीटी भुगतान जारी ➔ PFMS प्रणाली द्वारा 24 से 48 घंटे के भीतर सीधे किसान के आधार-लिंक्ड बैंक खाते में राशि ट्रांसफर व यूटीआर (UTR) नंबर जारी।"
          ],
          navPath: '/track',
          navText: "खरीद स्थिति ट्रैकर पर जाएं"
        };
      } else {
        return {
          reply: formatReply("Here are the steps to track your crop procurement and bank payment in real time:"),
          newLang: newLanguageTriggered,
          steps: [
            "Go to the 'Track Procurement' page (/track).",
            "Enter your Token ID (e.g., TK-UP-2026-0001) or registered 10-digit mobile number, or click any active token in the live stream carousel.",
            "Follow the 5-Stage Milestone Timeline:",
            "  1. Slot Scheduled ➔ Token & capacity reserved.",
            "  2. Mandi Arrival ➔ Entry gate QR code scanned.",
            "  3. Quality & Moisture Assay ➔ Digital moisture sensor analysis (≤ 17.0%).",
            "  4. Weighbridge Weighed ➔ Gross minus tare weight recorded on electronic bridge.",
            "  5. DBT Payment Disbursed ➔ PFMS triggers direct credit to your Aadhaar-linked bank account within 24 to 48 hours, showing the official bank UTR reference number."
          ],
          navPath: '/track',
          navText: "Go to Procurement Tracker"
        };
      }
    }

    // 8.5. Detailed: BUYER AGENCY, CROP-FOR-VALUE EXCHANGE & J-FORM
    if (
      text.includes('buyer') || 
      text.includes('purchase') || 
      text.includes('agency') || 
      text.includes('fci') || 
      text.includes('nafed') || 
      text.includes('j-form') || 
      text.includes('jform') || 
      text.includes('form j') || 
      text.includes('जे-फॉर्म') || 
      text.includes('खरीदार') || 
      text.includes('खरीददार') || 
      text.includes('क्रेता') || 
      text.includes('who buys') || 
      text.includes('purchasing') ||
      text.includes('who is buying') ||
      text.includes('kon kharidega') ||
      text.includes('kaun kharidega')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("फसल की खरीद, क्रेता एजेंसी (Buyer) एवं जे-फॉर्म (J-Form) की कार्यप्रणाली:"),
          newLang: newLanguageTriggered,
          steps: [
            "अधिकृत सरकारी क्रेता: भारतीय खाद्य निगम (FCI), नेफेड (NAFED), राज्य नागरिक आपूर्ति निगम (जैसे मार्कफेड, उप्र खाद्य निगम) और प्रमाणित मिलर्स 'क्रेता डेस्क' (/buyer) पर पंजीकृत होते हैं।",
            "फसल लॉट निरीक्षण: मंडी में धर्मकांटा तुलाई और नमी जांच (≤ 17.0%) पूर्ण होते ही किसान का अनाज लॉट क्रेता एजेंसी के एक्सचेंज बोर्ड पर लाइव दिखने लगता है।",
            "सरकारी समर्थन मूल्य (MSP) पर क्रय: क्रेता एजेंसी सरकारी दरों पर खरीद आदेश स्वीकार करती है (उदा. धान सामान्य ₹2,320, ग्रेड-ए ₹2,380 प्रति क्विंटल)।",
            "कानूनी जे-फॉर्म (Form-J) जारी होना: खरीद की पुष्टि होते ही सिस्टम डिजिटल हस्ताक्षर व क्यूआर कोड युक्त आधिकारिक जे-फॉर्म (बिक्री प्रमाणपत्र) जारी करता है।",
            "सीधे बैंक खाते में डीबीटी (DBT): क्रेता के एस्क्रो ट्रेजरी खाते से पूरी सरकारी राशि किसान के आधार-लिंक्ड बैंक खाते में PFMS द्वारा 24-48 घंटे के भीतर यूटीआर (UTR) सहित ट्रांसफर हो जाती है।"
          ],
          navPath: '/buyer',
          navText: "क्रेता व खरीद एजेंसी डेस्क खोलें"
        };
      } else {
        return {
          reply: formatReply("Here is how Authorized Buyer Agencies purchase crops and exchange value on the platform:"),
          newLang: newLanguageTriggered,
          steps: [
            "Authorized Institutional Buyers: Food Corporation of India (FCI), NAFED, State Civil Supplies Corporations (Markfed, UPSFCS), and licensed food processors log in via the 'Buyer Desk' (/buyer).",
            "Live Grain Exchange Floor: As soon as a farmer's lot is weighed on the electronic bridge and passes moisture testing (≤ 17.0%), it appears on the Buyer's trading board.",
            "MSP Purchase Order Execution: The Buyer accepts the lot at the statutory Minimum Support Price (e.g. Paddy Common ₹2,320, Grade A ₹2,380 per Qtl).",
            "Official Form-J (J-Form) Issuance: The system generates the legal Form-J purchase certificate complete with buyer digital seal and QR validation.",
            "Synchronized Escrow DBT Remittance: The procurement value is automatically debited from the Buyer's treasury escrow and credited directly to the farmer's Aadhaar-linked bank account within 24-48 hours with a unique bank UTR number."
          ],
          navPath: '/buyer',
          navText: "Go to Buyer & Procurement Agency Desk"
        };
      }
    }

    // 9. Detailed: MANDI OPERATOR CONSOLE
    if (
      text.includes('mandi console') || 
      text.includes('operator') || 
      text.includes('weighbridge') || 
      text.includes('धर्मकांटा') || 
      text.includes('ऑपरेटर') || 
      text.includes('gate') ||
      text.includes('तुलाई') ||
      text.includes('weigh') ||
      text.includes('dharmkanta') ||
      text.includes('tolaai') ||
      text.includes('tulai') ||
      text.includes('wajan') ||
      text.includes('vajan')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("मंडी ऑपरेटर कंसोल (/mandi-console) के कार्य:"),
          newLang: newLanguageTriggered,
          steps: [
            "मंडी केंद्र चयन: अपनी मंडी (लखनऊ, खन्ना, भोपाल, करनाल, संबलपुर, रायपुर) चुनें।",
            "मंडी सेटिंग्स: मंडी व्यवस्थापक दैनिक खरीद क्षमता (MT) और औसत तुलाई समय बदल सकते हैं।",
            "फसल व कतार फिल्टर: धान, सोयाबीन, गेहूं या कतार चरण (Scheduled, Checked-In, Testing, Weighed) अनुसार फिल्टर करें।",
            "गेट चेक-इन: किसान के आगमन पर 'Check In' दबाएं।",
            "धर्मकांटा टर्मिनल: 'Weighbridge Input' बटन से कुल वजन, खाली गाड़ी का वजन, नमी (%) और ग्रेड दर्ज करें; शुद्ध वजन और कुल सरकारी राशि स्वतः निकलेगी।",
            "सीधे DBT भुगतान ट्रिगर: एक क्लिक में सरकारी भुगतान आदेश और यूटीआर नंबर जारी करें।"
          ],
          navPath: '/mandi-console',
          navText: "मंडी ऑपरेटर कंसोल खोलें"
        };
      } else {
        return {
          reply: formatReply("Here are the operational functions available on the Mandi Operator Console (/mandi-console):"),
          newLang: newLanguageTriggered,
          steps: [
            "Area Switcher: Select your specific procurement center (Lucknow, Khanna, Bhopal, Karnal, Sambalpur, Raipur).",
            "Mandi Settings: Mandi administrators can adjust the 'Daily Max Tonnage Capacity' and 'Average Service Time per Vehicle' on the fly.",
            "Crop & Stage Filters: Filter appointments by Paddy, Soybean, Wheat or by queue stage (Scheduled, Checked-In, Testing, Weighed).",
            "Gate QR Check-In: Click 'Check In' when a farmer arrives at the gate to advance their queue token.",
            "Weighbridge Terminal Modal: Click 'Weighbridge Input' to record live Gross Weight (KG), Tare Weight (KG), Moisture (%), and Grade. Net weight and total MSP are auto-calculated.",
            "Trigger DBT Payout: One-click action generating the government electronic payment order.",
            "Weighbridge Lane Adjuster: Click '+1 Lane' or '-1 Halt' to automatically recalculate live wait times across the mandi."
          ],
          navPath: '/mandi-console',
          navText: "Go to Mandi Operator Console"
        };
      }
    }

    // 10. Detailed: POLICY & LOGISTICS ANALYTICS
    if (
      text.includes('analytics') || 
      text.includes('policy') || 
      text.includes('logistics') || 
      text.includes('truck') || 
      text.includes('fci') || 
      text.includes('silo') || 
      text.includes('demurrage') || 
      text.includes('विश्लेषण') || 
      text.includes('रसद') ||
      text.includes('ट्रक') ||
      text.includes('rasad') ||
      text.includes('godam') ||
      text.includes('bhandaran')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("नीति एवं रसद विश्लेषण कंसोल (/analytics) के प्रशासनिक नियंत्रण:"),
          newLang: newLanguageTriggered,
          steps: [
            "राज्य व फसल फिल्टर: राज्य (पंजाब, हरियाणा, उप्र, मप्र, ओडिशा, छग) और फसल अनुसार डेटा देखें।",
            "प्रमुख सूचकांक (KPI): कुल उपार्जित मात्रा, डीबीटी भुगतान (₹ करोड़), औसत प्रतीक्षा समय (24.6 मिनट) और गोदाम नुकसान बचत (₹142.8 करोड़)।",
            "जिला कोटा नियंत्रण: राज्य प्रशासक जिलों के खरीद लक्ष्य में '+5K MT' या '-5K MT' का लाइव बदलाव कर सकते हैं।",
            "आपातकालीन ट्रक आवंटन: साइलो जाम से बचने हेतु 'Deploy +50 Trucks' पर क्लिक करके तुरंत अतिरिक्त परिवहन ट्रक तैनात करें।",
            "सरकारी ऑडिट डाउनलोड: एक क्लिक में पूरे राज्य का आधिकारिक CSV डेटा डाउनलोड करें।"
          ],
          navPath: '/analytics',
          navText: "नीति एवं रसद विश्लेषण पेज पर जाएं"
        };
      } else {
        return {
          reply: formatReply("Here are the operational administrative controls available on the Policy & Logistics Suite (/analytics):"),
          newLang: newLanguageTriggered,
          steps: [
            "Macro State & Crop Filters: State and central authorities (DoCA / FCI) can filter national data by State (Punjab, UP, MP, Haryana, Odisha, CG) and Commodity.",
            "Live KPI Monitoring: Displays total tonnage procured, DBT disbursed (₹ Cr), average wait times (24.6 mins), and storage demurrage savings (₹142.8 Cr).",
            "District Target Quota Control: Admins can click '+5K MT' or '-5K MT' to re-balance procurement targets between districts in real time.",
            "Emergency Freight Dispatch: Click 'Deploy +50 Trucks' on any congested grain corridor to evacuate storage silos and lower demurrage risk from HIGH to LOW.",
            "Export Official CSV: One-click export of state-wise procurement and financial audit logs."
          ],
          navPath: '/analytics',
          navText: "Go to Policy & Logistics Analytics"
        };
      }
    }

    // 11. Detailed: MSP RATES 2026-27
    if (
      text.includes('msp') || 
      text.includes('rate') || 
      text.includes('price') || 
      text.includes('मूल्य') || 
      text.includes('भाव') || 
      text.includes('भाअ') || 
      text.includes('दर') ||
      text.includes('support price') ||
      text.includes('bhav') ||
      text.includes('daam') ||
      text.includes('kimat')
    ) {
      if (activeLang === 'hi') {
        return {
          reply: formatReply("खरीफ सत्र 2026-27 हेतु केंद्र सरकार (CCEA / CACP) द्वारा घोषित न्यूनतम समर्थन मूल्य (MSP) दरें:"),
          newLang: newLanguageTriggered,
          steps: [
            "धान (Paddy) - सामान्य ग्रेड: ₹ 2,320 प्रति क्विंटल (FCI / राज्य खरीद एजेंसियां)",
            "धान (Paddy) - ग्रेड 'ए': ₹ 2,380 प्रति क्विंटल (FCI / राज्य खरीद एजेंसियां)",
            "सोयाबीन (Soybean) - पीला: ₹ 4,892 प्रति क्विंटल (NAFED / राज्य महासंघ)",
            "गेहूं (Wheat) - मानक FAQ: ₹ 2,275 प्रति क्विंटल (FCI / मार्कफेड)",
            "मक्का (Maize): ₹ 2,090 प्रति क्विंटल",
            "विशेष ध्यान: यह राशि 100% बिना किसी बिचौलिए कटौती के सीधे किसान के बैंक खाते में जमा होती है।"
          ],
          navPath: '/',
          navText: "होमपेज पर आधिकारिक MSP तालिका देखें"
        };
      } else {
        return {
          reply: formatReply("Notified Minimum Support Price (MSP) Rates for Kharif Season 2026-27 (Fixed by CCEA / CACP):"),
          newLang: newLanguageTriggered,
          steps: [
            "Paddy (धान) - Common Grade: ₹2,320 per Quintal (Procured via FCI / State Agencies)",
            "Paddy (धान) - Grade A: ₹2,380 per Quintal (Procured via FCI / State Agencies)",
            "Soybean (सोयाबीन) - Yellow: ₹4,892 per Quintal (Procured via NAFED / State Federations)",
            "Wheat (गेहूं) - FAQ Standard: ₹2,275 per Quintal (Procured via FCI / Markfed)",
            "Maize (मक्का): ₹2,090 per Quintal",
            "Note: Payments are credited 100% directly to the farmer's bank account with zero intermediary cuts."
          ],
          navPath: '/',
          navText: "View Official MSP Table on Homepage"
        };
      }
    }

    // 12. Irrelevant / Out-of-Scope Queries
    if (activeLang === 'hi') {
      return {
        reply: formatReply("मुझे विशेष रूप से स्मार्ट कृषि अधिप्राप्ति कतार प्रबंधन पोर्टल (SAP-QMP) की सहायता के लिए तैयार किया गया है। आपका यह प्रश्न इस पोर्टल के दायरे से बाहर प्रतीत होता है।\n\nकृपया पोर्टल से संबंधित प्रश्न पूछें जैसे:\n• किसान पंजीकरण व भूलेख खसरा सत्यापन\n• मंडी स्लॉट बुकिंग, क्यूआर टोकन व सादा फोन SMS\n• फसल सैंपल फोटो जांच व न्यूनतम समर्थन मूल्य (MSP)\n• खरीद स्थिति ट्रैकिंग व बैंक खाते में भुगतान\n• मंडी ऑपरेटर व रसद परिवहन प्रबंधन\n\nइनमें से मैं आपकी क्या मदद कर सकती हूँ?"),
        newLang: newLanguageTriggered,
        isIrrelevant: true
      };
    } else {
      return {
        reply: formatReply("I am specifically designed to assist with the Smart Agricultural Procurement Queue Management Platform (SAP-QMP). Your question appears outside this scope.\n\nPlease ask questions related to:\n• Farmer registration & Bhulekh land survey sync\n• Mandi slot booking, QR tokens & keypad phone SMS passes\n• Pre-mandi crop sample photo inspection & assayer checks\n• Minimum Support Price (MSP) rates & DBT bank remittance\n• Mandi operator check-in, weighbridge entry & logistics analytics.\n\nHow may I help you with any of these?"),
        newLang: newLanguageTriggered,
        isIrrelevant: true
      };
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || sessionEnded) return;

    const userText = inputVal.trim();
    const newMsgList = [
      ...messages,
      { sender: 'user', text: userText, time: 'Just now' }
    ];
    setMessages(newMsgList);
    setInputVal('');

    setTimeout(() => {
      const response = processQuery(userText, botLang);

      if (response.newLang) {
        setBotLang(response.newLang);
      }

      if (response.endSession) {
        setSessionEnded(true);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: response.reply,
          steps: response.steps || null,
          navPath: response.navPath || null,
          navText: response.navText || null,
          quickOptions: response.quickOptions || null,
          time: 'Just now'
        }
      ]);
    }, 350);
  };

  const handleQuickClick = (txt) => {
    if (sessionEnded) return;
    setInputVal(txt);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-linear-to-r from-emerald-700 to-emerald-900 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-amber-300 cursor-pointer"
          aria-label="Open Dhwani Virtual Assistant"
        >
          <Bot className="w-6 h-6 text-amber-300" />
          <span className="text-xs font-extrabold pr-1 hidden sm:inline">{t.botTitle}</span>
        </button>
      ) : (
        <div className="bg-white w-92 sm:w-104 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-136 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header with Language Indicator */}
          <div className="bg-emerald-950 text-white p-4 flex justify-between items-center border-b border-emerald-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center border border-amber-300 shadow-xs">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center">
                  <span>{t.botTitle}</span>
                  <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-800 text-[9px] text-amber-300 rounded font-semibold uppercase">
                    {botLang === 'hi' ? 'हिन्दी मोड' : botLang === 'pa' ? 'ਪੰਜਾਬੀ ਮੋਡ' : 'AI Assistant'}
                  </span>
                </h4>
                <p className="text-[10px] text-emerald-200">
                  {botLang === 'hi' ? 'स्मार्ट कृषि अधिप्राप्ति सहायक' : 'Official Agricultural Procurement Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Language Switch Pills inside Bot */}
              <div className="flex bg-emerald-900 border border-emerald-700 rounded-lg p-0.5 text-[10px] font-bold">
                <button
                  onClick={() => {
                    const notice = switchLanguage('hi');
                    setMessages(prev => [...prev, { sender: 'bot', text: notice, time: 'Just now' }]);
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${botLang === 'hi' ? 'bg-amber-400 text-slate-950' : 'text-emerald-200 hover:text-white'}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => {
                    const notice = switchLanguage('en');
                    setMessages(prev => [...prev, { sender: 'bot', text: notice, time: 'Just now' }]);
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${botLang === 'en' ? 'bg-amber-400 text-slate-950' : 'text-emerald-200 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    const notice = switchLanguage('pa');
                    setMessages(prev => [...prev, { sender: 'bot', text: notice, time: 'Just now' }]);
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${botLang === 'pa' ? 'bg-amber-400 text-slate-950' : 'text-emerald-200 hover:text-white'}`}
                >
                  ਪੰ
                </button>
              </div>

              <button
                onClick={handleRestartSession}
                title="Restart Conversation"
                className="text-emerald-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="bg-emerald-50/80 px-3 py-2 border-b border-emerald-100 flex gap-1.5 overflow-x-auto text-[11px] font-semibold text-emerald-950 scrollbar-none">
            {botLang === 'hi' ? (
              <>
                <button
                  onClick={() => handleQuickClick('किसान पंजीकरण कैसे करें?')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  पंजीकरण
                </button>
                <button
                  onClick={() => handleQuickClick('मंडी स्लॉट कैसे बुक करें?')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  स्लॉट बुकिंग
                </button>
                <button
                  onClick={() => handleQuickClick('मेरे पास स्मार्टफोन नहीं है')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  सादा फोन SMS
                </button>
                <button
                  onClick={() => handleQuickClick('फसल सैंपल फोटो जांच')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  सैंपल जांच
                </button>
                <button
                  onClick={() => handleQuickClick('न्यूनतम समर्थन मूल्य (MSP) दरें 2026-27')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  MSP दरें
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickClick('How to register as farmer?')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  Registration
                </button>
                <button
                  onClick={() => handleQuickClick('How to book mandi slot?')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  Slot Booking
                </button>
                <button
                  onClick={() => handleQuickClick('I do not have smartphone')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  Offline SMS
                </button>
                <button
                  onClick={() => handleQuickClick('Crop sample photo inspector check')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  Sample Photo
                </button>
                <button
                  onClick={() => handleQuickClick('Kharif MSP rates 2026-27')}
                  className="bg-white border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  MSP Rates
                </button>
              </>
            )}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line text-xs font-normal">{m.text}</p>
                  
                  {/* Step-by-Step Breakdown Card */}
                  {m.steps && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <strong className="text-[11px] uppercase tracking-wider text-emerald-800 block">
                        {botLang === 'hi' ? 'आधिकारिक क्रमवार प्रक्रिया चरण:' : 'Official Procedure Steps:'}
                      </strong>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700">
                        {m.steps.map((st, sIdx) => (
                          <li key={sIdx} className="leading-normal">{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Navigation Action Button */}
                  {m.navPath && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          navigate(m.navPath);
                          setIsOpen(false);
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <span>{m.navText || (botLang === 'hi' ? 'पेज पर जाएं' : 'Navigate to Page')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Dynamic Quick Options */}
                  {m.quickOptions && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {m.quickOptions.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuickClick(opt)}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-[10px] text-emerald-800 font-semibold cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] mt-1.5 block ${m.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {sessionEnded && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 space-y-1">
                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                <p className="font-bold">
                  {botLang === 'hi' ? 'सहायता सत्र संपन्न एवं समाप्त' : 'Support Session Resolved & Concluded'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {botLang === 'hi' ? 'कोई नया सवाल पूछने हेतु नीचे क्लिक करें।' : 'Have another query? Click below to restart a fresh session.'}
                </p>
                <button
                  onClick={handleRestartSession}
                  className="mt-2 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {botLang === 'hi' ? 'नया सत्र प्रारंभ करें' : 'Start New Query Session'}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              disabled={sessionEnded}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                sessionEnded 
                  ? (botLang === 'hi' ? "सत्र समाप्त हुआ। नया सवाल पूछने के लिए रीस्टार्ट करें।" : "Session ended. Click restart to ask new query.") 
                  : (botLang === 'hi' ? "हिन्दी या अंग्रेजी में अपना सवाल पूछें..." : t.botPlaceholder)
              }
              className={`flex-1 px-3.5 py-2 text-xs border rounded-xl focus:outline-none ${
                sessionEnded ? 'bg-slate-100 border-slate-200 text-slate-400' : 'border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white'
              }`}
            />
            <button
              type="submit"
              disabled={sessionEnded || !inputVal.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
