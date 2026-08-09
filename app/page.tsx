import { ReactNode } from 'react';

import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ImprintDialog from '@/components/ImprintDialog';
import JordBanner from '@/components/JordBanner';
import Nav from '@/components/Nav';
import PrivacyPolicyDialog from '@/components/PrivacyPolicyDialog';
import References from '@/components/References';
import Services from '@/components/Services';
import TopBar from '@/components/TopLink';

import styles from '@/app/page.module.css';

const Home = (): ReactNode => (
  <main>
    <TopBar />
    <Nav />
    <div className={styles.Content}>
      <Hero />
      <About />
      <References />
      <JordBanner />
      <Services />
      <Contact />
      <Footer />
      <PrivacyPolicyDialog />
      <ImprintDialog />
    </div>
  </main>
);

export default Home;
