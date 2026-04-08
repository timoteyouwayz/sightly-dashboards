import { Users, Heart, BookOpen, School, Briefcase, UserCheck, Edit3, Mail, Phone, MapPin } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { TestimoniesHeroCarousel } from '@/components/dashboard/TestimoniesHeroCarousel';
import { useCountUp } from '@/hooks/useCountUp';

type StatKey = 'reached' | 'bornAgain' | 'discipled' | 'schools' | 'counties' | 'partnersTrained';

interface ActivityItem {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  bgImage: string;
  href?: string;
}

interface Testimonial {
  name: string;
  location: string;
  statement: string;
  image: string;
  fullStory: string;
}

const defaultActivities: ActivityItem[] = [
  {
    title: 'School Missions',
    description: 'Supporting schools with discipleship, mentorship and outreach programs.',
    icon: Users,
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/project/school-missions/',
  },
  {
    title: 'CPMK',
    description: 'Community ministry and youth empowerment through CPMK initiatives.',
    icon: Briefcase,
    bgImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/project/cpmk/',
  },
  {
    title: 'Kizazi Sasa Campsite',
    description: 'Retreats, camps and training in a safe, faith-filled environment.',
    icon: School,
    bgImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/project/kizazi-sasa-campsite/',
  },
  {
    title: 'Digital Skills',
    description: 'Equipping young people with tech skills, digital literacy and creative media.',
    icon: BookOpen,
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/project/digital-skills/',
  },
  {
    title: 'Sports Ministry',
    description: 'Building character, teamwork and faith through sports outreach.',
    icon: Heart,
    bgImage: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/project/sports-ministry/',
  },
  {
    title: 'Leadership Training',
    description: 'Developing leaders through mentoring, coaching and spiritual formation.',
    icon: UserCheck,
    bgImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    href: 'https://kenyayfc.org/',
  },
];

const statColors = [
  'from-sky-500/20 to-sky-600/10 border-sky-400/30',
  'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30',
  'from-indigo-500/20 to-indigo-600/10 border-indigo-400/30',
  'from-violet-500/20 to-violet-600/10 border-violet-400/30',
  'from-amber-500/20 to-amber-600/10 border-amber-400/30',
  'from-slate-500/20 to-slate-600/10 border-slate-400/30',
];

const activityColors = [
  'from-sky-500/15 via-sky-500/5 border-sky-300/20 text-sky-100',
  'from-emerald-500/15 via-emerald-500/5 border-emerald-300/20 text-emerald-100',
  'from-violet-500/15 via-violet-500/5 border-violet-300/20 text-violet-100',
  'from-amber-500/15 via-amber-500/5 border-amber-300/20 text-amber-100',
];

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Aisha',
    location: 'Machakos',
    statement: 'YFC has given me a leadership voice and a family in Christ. The youth meetings are a life-line.',
    image: '/images/testimonial-1.jpg',
    fullStory:
      'Aisha joined YFC in 2023 and has since led the weekend youth group. Her story is an example of leadership, faith, and community service.',
  },
  {
    name: 'Samuel',
    location: 'Nairobi',
    statement: 'I was lost before YFC. Today I serve as a worship leader and mentor younger students.',
    image: '/images/testimonial-2.jpg',
    fullStory:
      'Samuel discovered purpose through discipleship training and now organizes music sessions at school and church. He actively mentors younger students each week.',
  },
  {
    name: 'Grace',
    location: 'Mombasa',
    statement: 'The discipleship training helped me to start community Bible discussions in my school.',
    image: '/images/testimonial-3.jpg',
    fullStory:
      'Grace started a Bible study circle in her school and helped other students with personal growth. YFC support helped her present at the county youth forum.',
  },
];

const statItems = [
  { label: 'Youth Reached', key: 'reached' as StatKey, icon: Users, color: 'bg-sky-500/10 text-sky-600' },
  { label: 'Born Again', key: 'bornAgain' as StatKey, icon: Heart, color: 'bg-emerald-500/10 text-emerald-600' },
  { label: 'Discipled', key: 'discipled' as StatKey, icon: BookOpen, color: 'bg-indigo-500/10 text-indigo-600' },
  { label: 'Baptized', key: 'bornAgain' as StatKey, icon: UserCheck, color: 'bg-violet-500/10 text-violet-600' },
  { label: 'In Ministry', key: 'discipled' as StatKey, icon: Briefcase, color: 'bg-amber-500/10 text-amber-600' },
  { label: 'Schools', key: 'schools' as StatKey, icon: School, color: 'bg-slate-500/10 text-slate-600' },
];

export default function Index() {
  const { getAvailableYears, getYearTermData, getYearTotals, isEditMode } = useMinistryData();
  const years = getAvailableYears();
  const latestYear = years.length > 0 ? years[years.length - 1] : 2025;
  const yearTerms = getYearTermData(latestYear);
  const grandTotals = getYearTotals(latestYear);

  const [heroTitle, setHeroTitle] = useState('Kenya Youth for Christ');
  const [heroText, setHeroText] = useState(
    'Empowering young people across Kenya through discipleship, leadership development and community service. We partner with churches, schools and the local community to bring hope and practical support.'
  );

  const [activities, setActivities] = useState(defaultActivities);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [carouselInterval, setCarouselInterval] = useState(7000);

  useEffect(() => {
    const saved = localStorage.getItem('carouselInterval');
    if (saved) {
      setCarouselInterval(parseInt(saved));
    }
  }, []);

  const editHero = () => {
    if (!isEditMode) return;
    const newTitle = window.prompt('Update hero title', heroTitle);
    if (newTitle) setHeroTitle(newTitle);
    const newText = window.prompt('Update hero text', heroText);
    if (newText) setHeroText(newText);
  };

  const editActivity = (index: number) => {
    if (!isEditMode) return;
    const activity = activities[index];
    const title = window.prompt('Activity title', activity.title);
    const description = window.prompt('Activity description', activity.description);
    if (title && description) {
      setActivities((prev) => prev.map((item, i) => (i === index ? { ...item, title, description } : item)));
    }
  };

  const editTestimonial = (index: number) => {
    if (!isEditMode) return;
    const test = testimonials[index];
    const statement = window.prompt('Testimonial statement', test.statement);
    const fullStory = window.prompt('Full story text', test.fullStory);
    if (statement && fullStory) {
      setTestimonials((prev) => prev.map((item, i) => (i === index ? { ...item, statement, fullStory } : item)));
    }
  };

  const statBackgrounds: Record<StatKey, string> = {
    reached: "url('/images/reached-bg.jpg')",
    bornAgain: "url('/images/bornagain-bg.jpg')",
    discipled: "url('/images/discipled-bg.jpg')",
    schools: "url('/images/schools-bg.jpg')",
    counties: "url('/images/counties-bg.jpg')",
    partnersTrained: "url('/images/partners-bg.jpg')",
  };

  return (
    <main className="min-h-screen bg-white">
      <section id="hero" className="relative overflow-hidden bg-slate-950 pt-12 pb-20 sm:pt-16 sm:pb-24">
        <img
          src="/images/hero.jpg"
          alt="Kenya Youth for Christ"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <motion.img
          src="/images/hero.jpg"
          alt="Kenya Youth for Christ"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          animate={{ scale: [1.04, 1] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/60 to-slate-950/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 md:space-y-16">
            <div className="max-w-3xl">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm uppercase tracking-widest text-sky-300 font-semibold">Kenya Youth for Christ</p>
                    <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight max-w-3xl">
                      {heroTitle}
                    </h1>
                  </div>
                  {isEditMode && (
                    <button onClick={editHero} className="mt-4 lg:mt-0 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 shrink-0">
                      <Edit3 className="mr-2 inline h-4 w-4" /> Edit
                    </button>
                  )}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-slate-100 max-w-2xl">{heroText}</p>
                <div className="inline-flex">
                  <span className="inline-flex items-center rounded-full bg-sky-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-100 ring-1 ring-sky-400/30">
                    {latestYear} Latest Numbers
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {statItems.map((item, index) => {
                const value = grandTotals[item.key] ?? 0;
                const animatedValue = useCountUp(value);
                return (
                  <motion.article
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    viewport={{ once: true }}
                    className={`group rounded-xl border p-6 sm:p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${statColors[index]}`}
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-300 font-semibold group-hover:text-slate-200 transition">{item.label}</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.06 + 0.15 }}
                      viewport={{ once: true }}
                      className="mt-4 text-4xl sm:text-5xl font-bold text-white"
                    >
                      {animatedValue.toLocaleString()}
                    </motion.p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="stories-activities" className="px-4 py-16 sm:py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="mb-10">
                <p className="text-sm uppercase tracking-wider font-semibold text-sky-600">Stories of change</p>
                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">Real voices from the field</h2>
              </div>
              <div className="flex-1">
                <TestimoniesHeroCarousel testimonials={testimonials} autoPlayInterval={carouselInterval} onReadMore={setActiveTestimonial} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="mb-10">
                <p className="text-sm uppercase tracking-wider font-semibold text-sky-600">Our initiatives</p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">What we do</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 auto-rows-max">
                {activities.map((item, index) => {
                  const card = (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.bgImage})` }}
                      />
                      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" />
                      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Activity</p>
                          <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-100">{item.description}</p>
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition group-hover:text-white">
                          Learn more
                        </div>
                      </div>
                    </motion.div>
                  );

                  return item.href ? (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={item.title}>{card}</div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Dialog open={!!activeTestimonial} onOpenChange={(open) => { if (!open) setActiveTestimonial(null); }}>
        <DialogContent>
          {activeTestimonial && (
            <>
              <DialogHeader>
                <DialogTitle>{activeTestimonial.name}</DialogTitle>
                <DialogDescription>{activeTestimonial.location}</DialogDescription>
              </DialogHeader>
              <img src={activeTestimonial.image} alt={activeTestimonial.name} className="h-48 w-full object-cover rounded-md" />
              <p className="mt-4 text-sm text-foreground">{activeTestimonial.fullStory}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <section id="contact" className="relative z-10 px-4 pb-16 md:px-8 md:pb-20">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-display font-semibold text-foreground">Get in touch</h2>
            <p className="mt-2 text-muted-foreground">We are open to partnerships in VBS, youth camps, school programs, leadership training and community outreach.</p>
            <ul className="mt-4 space-y-3 text-sm text-foreground">
              <li>Vacation Bible School (VBS)</li>
              <li>Youth leadership and discipleship training</li>
              <li>School ministry and mentorship</li>
              <li>Community outreach, wellbeing & counseling</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-lg dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-foreground">Contact details</h3>
            <p className="mt-3 text-sm text-muted-foreground">Reach our team for local and national partnerships.</p>
            <div className="mt-4 space-y-4 text-sm text-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>headoffice@kenyayfc.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+254 712 345 678 </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="font-medium">Address</p>
                  <p>Karuna Close, Off Waiyaki Way. 
                     House no. 14</p>
                </div>
              </div>
            </div>
            <a href="mailto:headoffice@kenyayfc.org" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
              <Mail className="h-4 w-4" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
