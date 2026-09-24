import React from 'react';
import { SiteSettings } from '../types';

interface AdSenseBannerProps {
  slot: 'top_banner' | 'mid_content' | 'sidebar' | 'before_footer';
  settings: SiteSettings;
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot,
  settings,
  className = '',
}) => {
  // Check if ads globally enabled and slot enabled
  if (!settings.ads_enabled || !settings.ad_slots?.[slot]) {
    return null;
  }

  const slotLabels = {
    top_banner: 'Header Responsive Banner (728x90 / Responsive)',
    mid_content: 'In-Article Educational Context Ad (Responsive)',
    sidebar: 'Sidebar Sticky Unit (300x250 / 300x600)',
    before_footer: 'Footer Bottom Anchor Unit (Responsive)',
  };

  return (
    <div
      className={`my-6 mx-auto w-full transition-all text-center ${className}`}
      data-ad-slot={slot}
    >
      <div className="max-w-4xl mx-auto rounded-lg border border-dashed border-slate-300 bg-slate-100/70 p-4 relative overflow-hidden text-slate-500">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
          <span>Advertisement · Google AdSense Ready</span>
          <span>{settings.adsense_id || 'ID Pending'}</span>
        </div>

        <div className="py-6 sm:py-8 flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs font-medium text-slate-600">
            {slotLabels[slot]}
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm">
            Monetization space ready for AdSense code injection. Controlled directly from Admin Settings.
          </p>
        </div>

        {/* Real AdSense Ins tag container for live scripts */}
        {settings.adsense_id && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '60px' }}
            data-ad-client={settings.adsense_id}
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
};
