import Header from '../components/home/Header.jsx';
import Hero from '../components/home/Hero.jsx';
import Description from '../components/home/Description.jsx';
import Features from '../components/home/Features.jsx';
import HowItWorks from '../components/home/Howitworks.jsx';
import Gallery from '../components/home/Galery.jsx';
import Footer from '../components/home/Footer.jsx';
import '../style-sheets/home.css';

function Home() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <Description />
        <Features />
        <HowItWorks />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
