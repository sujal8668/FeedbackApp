import React from "react";
import Hero from "../../components/layouts/Hero";
import About from "../../components/layouts/About";
import Testimonials from "../../components/layouts/Testimonials";
import Review from "../../components/layouts/Review";
import Footer from '../../components/layouts/Footer'

const UserDashboard = () => {
  return (
    <div className="bg-white text-black">
      {/* Sections */}
      <section id="home">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="testimonials">
        <Testimonials />
        <Review/>
      </section>
      <Footer/>
    </div>
  );
};

export default UserDashboard;
