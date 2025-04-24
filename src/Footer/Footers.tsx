import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Footer, FooterLinkGroup, FooterLink, FooterIcon, FooterTitle, FooterDivider, FooterCopyright, FooterBrand } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

interface UserData {
    id: number;
    name: string;
    fullname?: string;
    email?: string;
    img?: string;
}

interface FooterProps {
    className?: string;
    isFixed?: boolean;
}


const Footers: React.FC<FooterProps> = ({  }) => {
    return (
        <Footer container>
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href="" by="Macth" year={2025} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="https://www.facebook.com/nookthawat" icon={BsFacebook} />
            <FooterIcon href="https://www.instagram.com/nt.tsri" icon={BsInstagram} />
            <FooterIcon href="https://x.com/nookthawat" icon={BsTwitter} />
            <FooterIcon href="https://github.com/N00kthawat" icon={BsGithub} />
          </div>
      </div>
    </Footer>
    );
};

export default Footers;