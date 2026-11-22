-- Case purposes now follow USCIS's processing-time categories for each form, and cover
-- I-360, I-129F and I-821D. Every earlier code is still allowed.
alter table public.cases drop constraint cases_filing_category_known;
alter table public.cases add constraint cases_filing_category_known check (
  filing_category is null or filing_category in (
    'c3b', 'c3c', 'c3a', 'c9', 'c8', 'c8-renewal', 'a5', 'a3', 'c26', 'a18', 'a17', 'tps', 'c11', 'c33', 'c10', 'c18', 'other',
    'i140-eb1a', 'i140-eb1b', 'i140-eb1c', 'i140-eb2perm', 'i140-eb2niw', 'i140-eb3', 'i140-ew3', 'i140-nurse', 'i140-other',
    'i129-h1b-new', 'i129-h1b-cos', 'i129-h1b-extension', 'i129-h1b-transfer', 'i129-h1b-amendment', 'i129-l1', 'i129-o1',
    'i129-e', 'i129-e3', 'i129-tn', 'i129-h2a', 'i129-h2b', 'i129-h3', 'i129-p', 'i129-q', 'i129-r', 'i129-other',
    'i485-family', 'i485-employment', 'i485-asylum', 'i485-refugee', 'i485-t-visa', 'i485-u-visa', 'i485-diversity', 'i485-other',
    'i130-spouse-citizen', 'i130-parent-citizen', 'i130-child-citizen', 'i130-adult-child-citizen', 'i130-married-child-citizen',
    'i130-sibling-citizen', 'i130-family-lpr', 'i130-adult-child-lpr', 'i130-other',
    'i539-h4', 'i539-h4-cos', 'i539-l2', 'i539-l2-cos', 'i539-f1-j1', 'i539-fmj-ext', 'i539-visitor', 'i539-b-cos',
    'i539-t', 'i539-u', 'i539-reinstatement', 'i539-other',
    'i131-advance-parole', 'i131-reentry', 'i131-refugee', 'i131-humanitarian', 'i131-other',
    'i360-religious', 'i360-sij', 'i360-vawa', 'i360-widow', 'i360-afghan-iraqi', 'i360-other',
    'i129f-k1', 'i129f-k3', 'i821d-initial', 'i821d-renewal'
  )
);
