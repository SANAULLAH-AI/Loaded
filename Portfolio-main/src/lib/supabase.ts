import { createClient } from '@supabase/supabase-js';
import { PortfolioData } from '../types/portfolio';

const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://lxdlgpvnlanoqulnxdch.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uS3y7vVXu9pkwvhiOp-aUQ_Wn6nBXjn';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PORTFOLIO_ROW_ID = 'main_portfolio';

/**
 * Fetch portfolio data from Supabase DB.
 * Falls back to null if table/row does not exist yet.
 */
export async function fetchPortfolioFromSupabase(): Promise<PortfolioData | null> {
  try {
    const { data, error } = await supabase
      .from('portfolio_store')
      .select('content')
      .eq('id', PORTFOLIO_ROW_ID)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch notice (table may need initial insertion):', error.message);
      return null;
    }

    if (data && data.content) {
      return data.content as PortfolioData;
    }
    return null;
  } catch (err) {
    console.error('Failed to load portfolio from Supabase:', err);
    return null;
  }
}

/**
 * Save portfolio data to Supabase DB.
 * Upserts row with ID 'main_portfolio'.
 */
export async function savePortfolioToSupabase(portfolioData: PortfolioData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('portfolio_store')
      .upsert(
        {
          id: PORTFOLIO_ROW_ID,
          content: portfolioData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase save error (if table does not exist, local backup is preserved):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save portfolio to Supabase:', err);
    return false;
  }
}
