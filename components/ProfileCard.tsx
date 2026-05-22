"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ProfileCardProps {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  imagePath?: string;
}

export default function ProfileCard({
  name,
  title,
  bio,
  email,
  linkedin,
  imagePath = "/profile-photo.jpg" // Default path - you can replace this later
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-container rounded-shape-lg p-8 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Photo */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-shape-lg overflow-hidden bg-surface-container-high border border-outline-variant"
          >
            <img
              src={imagePath}
              alt={name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {/* Name & Title */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-light text-on-surface mb-1.5 tracking-tight">
              {name}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium">{title}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />

          {/* Bio */}
          <p className="text-[13px] text-on-surface-variant leading-relaxed whitespace-pre-line">
            {bio}
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-on-primary rounded-shape-full text-sm font-medium transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </motion.a>
            <motion.a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-outline hover:border-on-surface text-on-surface rounded-shape-full text-sm font-medium transition-all duration-200"
            >
              <LinkedInIcon className="w-4 h-4" />
              LinkedIn
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
