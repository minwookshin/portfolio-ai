"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

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
      className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Photo */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200"
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
            <h2 className="text-3xl lg:text-4xl font-bold text-[#292A2E] mb-2 tracking-tight">
              {name}
            </h2>
            <p className="text-lg text-gray-600 font-medium">{title}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Bio */}
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed whitespace-pre-line">
            {bio}
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 px-6 py-3 bg-[#292A2E] hover:bg-[#3C3C3C] text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
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
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
