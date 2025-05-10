import React from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { User, Mail, Shield, Calendar, Edit } from 'lucide-react';

const ProfilePage = () => {
  // Get the authenticated user from context
  const [auth] = useAuth();

  // Extract user information
  const { name, email, image, role, isMember, _id } = auth.user;

  // Format date joined (placeholder - you'll need to add this field to your user data)
  const dateJoined = "April 2025"; // Replace with actual date from user data

  return (
<div className="w-screen min-h-screen mx-auto py-8 px-4 bg-black">
<div className="bg-black rounded-xl shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-black" />

        <div className="px-6 pb-8">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start relative">
            {/* Profile Image */}
            <div className="rounded-full border-4 border-white shadow-sm -mt-16 md:-mt-20 mb-4 md:mb-0 z-10">
              <img
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                src={image.url}
                alt={`${name}'s profile`}
              />
            </div>

            {/* Profile Info */}
            <div className="md:ml-6 text-center md:text-left pt-2 md:pt-6 flex-1">
              <h1 className="text-3xl font-semibold text-white">{name}</h1>
              <div className="flex items-center justify-center md:justify-start text-white mt-1">
                <Mail size={16} className="mr-2" />
                <span>{email}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-black text-white text-sm rounded-full font-medium flex items-center">
                  <Shield size={14} className="mr-1" />
                  {role}
                </span>
                {isMember && (
                  <span className="px-3 py-1 bg-black text-white text-sm rounded-full font-medium">
                    Member
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button className="absolute top-2 right-2 md:static md:mt-6 px-4 py-2 bg-black hover:bg-black text-white rounded-lg flex items-center transition duration-200">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Details Section */}
          <div className="flex flex-col md:flex-row mt-8 gap-6">
            {/* Info Card */}
            <div className="bg-black rounded-lg p-6 w-full shadow-sm flex-1">
              <h2 className="text-xl font-semibold text-white border-b w-full border-gray-300 pb-2 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="text-white mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-white text-sm">Username</p>
                    <p className="text-white">{name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="text-white mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-white text-sm">Email</p>
                    <p className="text-white">{email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="text-white mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-white text-sm">Role</p>
                    <p className="text-white capitalize">{role}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="text-white mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-white text-sm">Member status</p>
                    <p className="text-white capitalize">{isMember==true?"Active":"In active"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="text-white mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-white text-sm">Member Since</p>
                    <p className="text-white">{dateJoined}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
