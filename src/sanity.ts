import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your_project_id';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2023-05-03',
});

export interface ProfileData {
  name: string;
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
  email: string;
  phone: string;
  profilePicture: string; // URL
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
}

export interface ServiceData {
  num: string;
  name: string;
  desc: string;
}

export interface ProjectData {
  num: string;
  name: string;
  category: string;
  link: string;
  img1: string; // URL
  img2: string; // URL
  img3: string; // URL
}

export const getProfile = async (): Promise<ProfileData | null> => {
  try {
    const data = await client.fetch(`*[_type == "profile"][0]{
      name,
      heroTitle,
      heroDescription,
      aboutText,
      email,
      phone,
      "profilePicture": profilePicture.asset->url,
      githubUrl,
      linkedinUrl,
      instagramUrl,
      twitterUrl
    }`);
    return data || null;
  } catch (error) {
    console.error('Error fetching profile from Sanity:', error);
    return null;
  }
};

export const getServices = async (): Promise<ServiceData[] | null> => {
  try {
    const data = await client.fetch(`*[_type == "service"] | order(num asc) {
      num,
      name,
      desc
    }`);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return null;
  }
};

export const getProjects = async (): Promise<ProjectData[] | null> => {
  try {
    const data = await client.fetch(`*[_type == "project"] | order(num asc) {
      num,
      name,
      category,
      link,
      "img1": img1.asset->url,
      "img2": img2.asset->url,
      "img3": img3.asset->url
    }`);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return null;
  }
};
