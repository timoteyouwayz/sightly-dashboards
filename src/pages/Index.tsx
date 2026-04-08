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
}

interface Testimonial {
  name: string;
  location: string;
  statement: string;
  image: string;
  fullStory: string;
}

const defaultActivities: ActivityItem[] = [
  { title: 'Prayer Gatherings', description: 'Weekly prayer and worship evenings for young people across counties.', icon: Users, bgImage: '/images/activity-weekend-clubs.jpg' },
  { title: 'Bible Schools', description: 'Training leaders with practical theology and outreach skills.', icon: BookOpen, bgImage: '/images/activity-bible-schools.jpg' },
  { title: 'Community Outreach', description: 'Feeding, counseling, and prayer for local families.', icon: Heart, bgImage: '/images/activity-community-outreach.jpg' },
  { title: 'Youth Camps', description: 'Campfires and worship nights that transform hearts.', icon: School, bgImage: '/images/activity-youth-camps.jpg' },
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
                    Current year totals • {latestYear}
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
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col order-2 lg:order-1"
            >
              <div className="mb-10">
                <p className="text-sm uppercase tracking-wider font-semibold text-sky-600">Stories of change</p>
                <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">Real voices from the field</h2>
              </div>
              <div className="flex-1">
                <TestimoniesHeroCarousel testimonials={testimonials} autoPlayInterval={5000} onReadMore={setActiveTestimonial} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col order-1 lg:order-2"
            >
              <div className="mb-10">
                <p className="text-sm uppercase tracking-wider font-semibold text-sky-600">Our initiatives</p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">What we do</h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 auto-rows-max">
                {activities.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`group rounded-xl border-2 p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br ${statColors[index % statColors.length]} hover:border-opacity-100`}
                  >
                    <p className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 group-hover:text-slate-800 transition">{item.description}</p>
                  </motion.div>
                ))}
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
                  <p>kenya@yfc.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+254 712 345 678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-sky-500" />
                <div>
                  <p className="font-medium">Address</p>
                  <p>YFC Kenya Office, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            <a href="mailto:kenya@yfc.org" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
              <Mail className="h-4 w-4" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
