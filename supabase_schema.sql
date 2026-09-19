-- ==================================================
-- BLOODCONNECT SUPABASE DATABASE SCHEMA
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- Maps to auth.users.id
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('seeker', 'donor', 'hospital', 'blood_bank')),
  blood_group TEXT,
  phone TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  city TEXT,
  district TEXT DEFAULT 'Pathanamthitta',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_name TEXT NOT NULL,
  hospital_code TEXT,
  address TEXT,
  district TEXT DEFAULT 'Pathanamthitta',
  city TEXT,
  latitude DOUBLE PRECISION DEFAULT 9.385,
  longitude DOUBLE PRECISION DEFAULT 76.574,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOOD_BANKS TABLE
CREATE TABLE IF NOT EXISTS public.blood_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bank_code TEXT,
  address TEXT,
  district TEXT DEFAULT 'Pathanamthitta',
  city TEXT,
  latitude DOUBLE PRECISION DEFAULT 9.26,
  longitude DOUBLE PRECISION DEFAULT 76.78,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOOD_INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL,
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  reserved_units INTEGER DEFAULT 0,
  issued_units INTEGER DEFAULT 0,
  minimum_threshold INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BLOOD_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_code TEXT UNIQUE NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  patient_id TEXT,
  blood_group TEXT NOT NULL,
  units_required INTEGER NOT NULL,
  units_secured INTEGER DEFAULT 0,
  priority TEXT NOT NULL CHECK (priority IN ('NORMAL', 'URGENT', 'CRITICAL')),
  status TEXT NOT NULL CHECK (status IN ('CREATED', 'SEARCHING', 'DONORS_NOTIFIED', 'DONOR_ACCEPTED', 'HOSPITAL_CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DONORS TABLE
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  latitude DOUBLE PRECISION DEFAULT 9.26,
  longitude DOUBLE PRECISION DEFAULT 76.78,
  last_donation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('hospital', 'blood_bank', 'donor')),
  source_id UUID,
  units INTEGER DEFAULT 1,
  distance_km DOUBLE PRECISION,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for prototype demo convenience while keeping RLS enabled
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public Read Hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public Write Hospitals" ON public.hospitals FOR ALL USING (true);

CREATE POLICY "Public Read Blood Banks" ON public.blood_banks FOR SELECT USING (true);
CREATE POLICY "Public Write Blood Banks" ON public.blood_banks FOR ALL USING (true);

CREATE POLICY "Public Read Inventory" ON public.blood_inventory FOR SELECT USING (true);
CREATE POLICY "Public Write Inventory" ON public.blood_inventory FOR ALL USING (true);

CREATE POLICY "Public Read Requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Public Write Requests" ON public.blood_requests FOR ALL USING (true);

CREATE POLICY "Public Read Donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Public Write Donors" ON public.donors FOR ALL USING (true);

CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public Write Matches" ON public.matches FOR ALL USING (true);

CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Notifications" ON public.notifications FOR ALL USING (true);
