/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  const page404Style = {
    padding: '40px 0',
    background: '#fff',
    fontFamily: 'Arvo, serif',
  };

  const fourZeroFourBgStyle = {
    backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
    height: '400px',
    backgroundPosition: 'center',
    fontSize: '80px',
  };

  const link404Style = {
    color: '#fff',
    padding: '10px 20px',
    background: '#39ac31',
    margin: '20px 0',
    display: 'inline-block',
  };

  return (
    <section className="page_404" style={page404Style}>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg" style={fourZeroFourBgStyle}>
                <h1 className="text-center">404</h1>
              </div>

              <div className="contant_box_404" style={{marginTop: '-50px'}}>
                <h3 className="h2" style={{fontSize: '80px'}}>
                  Look like you're lost
                </h3>

                <p>the page you are looking for not available!</p>

                <Link href="/" className="link_404" style={link404Style}>Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
