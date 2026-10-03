import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Wrench,
  ShieldCheck,
  FileText,
  CreditCard,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  Bot,
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { DEALERSHIP_FAQS } from '../data/faqs';
import { FaqCategory, DealershipFaq } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DealershipFaqsProps {
  onOpenAiAdvisor?: () => void;
  onOpenContactBestPrice?: () => void;
}

export const DealershipFaqs: React.FC<DealershipFaqsProps> = ({
  onOpenAiAdvisor,
  onOpenContactBestPrice,
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(['servicing-schedule', 'warranty-period']));

  const categories: { key: FaqCategory; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { key: 'all', labelEn: 'All Questions', labelHi: 'सभी प्रश्न', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { key: 'servicing', labelEn: 'Servicing & Care', labelHi: 'सर्विसिंग व मेंटेनेंस', icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'insurance', labelEn: 'Insurance & Claims', labelHi: 'बीमा व कैशलेस क्लेम', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'warranty', labelEn: 'Warranty & Guarantee', labelHi: 'वारंटी व गारंटी', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { key: 'finance', labelEn: 'Finance & Exchange', labelHi: 'लोन व एक्सचेंज', icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return DEALERSHIP_FAQS.filter((faq) => {
      // Category match
      if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEnQ = faq.question.en.toLowerCase().includes(q);
        const matchesHiQ = faq.question.hi.toLowerCase().includes(q);
        const matchesEnA = faq.answer.en.toLowerCase().includes(q);
        const matchesHiA = faq.answer.hi.toLowerCase().includes(q);
        const matchesTags = faq.tags.some((tag) => tag.toLowerCase().includes(q));
        return matchesEnQ || matchesHiQ || matchesEnA || matchesHiA || matchesTags;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set(filteredFaqs.map((f) => f.id));
    setExpandedIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const getCategoryBadge = (cat: DealershipFaq['category']) => {
    switch (cat) {
      case 'servicing':
        return {
          label: language === 'hi' ? 'सर्विसिंग' : 'Servicing',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          icon: <Wrench className="w-3 h-3 text-blue-400" />,
        };
      case 'insurance':
        return {
          label: language === 'hi' ? 'बीमा सुरक्षा' : 'Insurance',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          icon: <FileText className="w-3 h-3 text-amber-400" />,
        };
      case 'warranty':
        return {
          label: language === 'hi' ? 'हीरो वारंटी' : 'Warranty',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
        };
      case 'finance':
        return {
          label: language === 'hi' ? 'फाइनेंस' : 'Finance',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          icon: <CreditCard className="w-3 h-3 text-purple-400" />,
        };
      default:
        return {
          label: 'General',
          color: 'text-gray-400 bg-white/5 border-white/10',
          icon: <HelpCircle className="w-3 h-3 text-gray-400" />,
        };
    }
  };

  return (
    <section id="dealership-faqs-section" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Confidence Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="bg-[#141414] border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-md hover:border-emerald-500/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-wider block font-['Rajdhani']">
              5-Year Warranty
            </span>
            <span className="text-[11px] text-gray-400 leading-tight block">
              70,000 km standard coverage
            </span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-md hover:border-blue-500/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-wider block font-['Rajdhani']">
              5 Free Services
            </span>
            <span className="text-[11px] text-gray-400 leading-tight block">
              Labor-free pan-India maintenance
            </span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-md hover:border-amber-500/30 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-wider block font-['Rajdhani']">
              Cashless Claims
            </span>
            <span className="text-[11px] text-gray-400 leading-tight block">
              Direct settlement with top insurers
            </span>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-md hover:border-[#D6181F]/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#D6181F]/10 border border-[#D6181F]/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#D6181F]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-white uppercase tracking-wider block font-['Rajdhani']">
              100% Genuine Spares
            </span>
            <span className="text-[11px] text-gray-400 leading-tight block">
              Official Hero Genuine Parts
            </span>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6181F]/10 border border-[#D6181F]/20 text-[#D6181F] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'डीलरशिप प्रश्नोत्तरी' : 'Dealership Knowledge Base'}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white font-['Rajdhani'] uppercase tracking-tight">
          {language === 'hi' ? (
            <>सर्विसिंग, बीमा और <span className="text-[#D6181F]">वारंटी अक्सर पूछे जाने वाले सवाल</span></>
          ) : (
            <>Frequently Asked Questions: <span className="text-[#D6181F]">Service, Insurance & Warranty</span></>
          )}
        </h2>

        <p className="text-sm text-gray-400 leading-relaxed">
          {language === 'hi'
            ? 'श्री राम हीरो अधिकृत कंसल्टेंट्स द्वारा सत्यापित स्पष्ट जानकारी। अपनी हीरो बाइक के फ्री सर्विस शेड्यूल, 5 साल की वारंटी और कैशलेस बीमा दावों के बारे में विस्तार से जानें।'
            : 'Clear, transparent answers verified by Shri Ram Hero certified advisors. Understand your 5-year warranty terms, free service schedule, cashless insurance claims, and Joyride maintenance benefits.'}
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`faq-tab-${cat.key}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D6181F] text-white shadow-md shadow-[#D6181F]/30'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat.icon}
                  <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'सर्च करें: फ्री सर्विस, वारंटी, कैशलेस, इंजन ऑयल, बैटरी...'
                  : 'Search: free service, warranty, cashless, engine oil, joyride...'
              }
              className="w-full pl-9 pr-8 py-2 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D6181F] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer p-0.5"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Strip & Expand/Collapse Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>
              {language === 'hi'
                ? `दिखाए जा रहे प्रश्न: ${filteredFaqs.length}`
                : `Showing ${filteredFaqs.length} FAQs`}
            </span>
            {searchQuery && (
              <span className="text-[#D6181F] font-semibold">
                (filter: "{searchQuery}")
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-expand-all-faqs"
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'सभी खोलें' : 'Expand All'}
            </button>
            <button
              id="btn-collapse-all-faqs"
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'सभी बंद करें' : 'Collapse All'}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.has(faq.id);
            const badge = getCategoryBadge(faq.category);
            const questionText = language === 'hi' ? faq.question.hi : faq.question.en;
            const answerText = language === 'hi' ? faq.answer.hi : faq.answer.en;
            const takeawayText = faq.keyTakeaway
              ? language === 'hi'
                ? faq.keyTakeaway.hi
                : faq.keyTakeaway.en
              : null;

            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-[#151515] border-white/20 shadow-lg'
                    : 'bg-[#111111] border-white/10 hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  id={`btn-faq-trigger-${faq.id}`}
                  onClick={() => toggleExpand(faq.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.color}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                      {faq.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D6181F]/15 border border-[#D6181F]/30 text-[#D6181F]">
                          ★ {language === 'hi' ? 'लोकप्रिय प्रश्न' : 'Most Asked'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] leading-snug">
                      {questionText}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isExpanded
                        ? 'bg-[#D6181F] border-[#D6181F] text-white rotate-180 shadow-md shadow-[#D6181F]/30'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
                        {/* Body text formatted with whitespace */}
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-normal">
                          {answerText}
                        </div>

                        {/* Highlighted Key Takeaway Box */}
                        {takeawayText && (
                          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5 text-xs">
                              <span className="font-bold text-emerald-300 uppercase tracking-wide text-[11px] block">
                                {language === 'hi' ? 'मुख्य बात (Key Takeaway):' : 'Key Dealership Takeaway:'}
                              </span>
                              <p className="text-emerald-100 font-medium leading-normal">
                                {takeawayText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Tags Strip */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mr-1">
                            {language === 'hi' ? 'टैग्स:' : 'Tags:'}
                          </span>
                          {faq.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setSearchQuery(tag)}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 bg-[#111] rounded-2xl border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase">
              {language === 'hi' ? 'कोई प्रश्न नहीं मिला' : 'No Matching Questions Found'}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {language === 'hi'
                ? `"${searchQuery}" के लिए कोई उत्तर नहीं मिला। कृपया दूसरे शब्द सर्च करें या फ़िल्टर रीसेट करें।`
                : `No results matching "${searchQuery}". Try searching for free service, battery warranty, joyride, or insurance.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'सभी प्रश्न देखें' : 'Clear Filter & Show All'}
          </button>
        </div>
      )}

      {/* Help & Support Callout Strip */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#181818] via-[#121212] to-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-[10px] font-bold text-[#D6181F] uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
            <Phone className="w-3 h-3 text-[#D6181F]" />
            <span>{language === 'hi' ? 'सीधा संपर्क सहायता' : 'Authorized Support Desk'}</span>
          </div>
          <h4 className="text-lg font-bold text-white font-['Rajdhani'] uppercase">
            {language === 'hi' ? 'क्या आपका प्रश्न यहाँ सूचीबद्ध नहीं है?' : 'Have another question regarding your Hero vehicle?'}
          </h4>
          <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
            {language === 'hi'
              ? 'हमारे प्रमाणित सर्विस एडवाइजर और AI असिस्टेंट आपकी किसी भी प्रकार की सहायता, जॉब कार्ड स्थिति या कोटेशन के लिए 24/7 तैयार हैं।'
              : 'Our certified service advisors and 24/7 Hero AI Advisor are here to assist with custom job-card inquiries, claim status, or warranty claims.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <a
            id="faq-call-helpline"
            href="tel:8890992086"
            className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#D6181F]" />
            <span>8890992086</span>
          </a>

          {onOpenAiAdvisor && (
            <button
              id="faq-btn-ask-ai"
              type="button"
              onClick={onOpenAiAdvisor}
              className="px-4 py-2.5 rounded-lg bg-[#D6181F] hover:bg-[#b5141a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D6181F]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'हीरो AI से पूछें' : 'Ask Hero AI Advisor'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
