-- What a case is for, now for I-140, I-129, I-485, I-130, I-539 and I-131 as well as
-- I-765. The I-765 codes are unchanged; the others start with the form.
alter table public.cases drop constraint cases_filing_category_known;
alter table public.cases add constraint cases_filing_category_known check (
  filing_category is null or filing_category in (
    'c3b', 'c3c', 'c3a', 'c9', 'c8', 'a5', 'c26', 'tps', 'c11', 'c33', 'other',
    'i140-eb1a', 'i140-eb1b', 'i140-eb1c', 'i140-eb2niw', 'i140-eb2perm', 'i140-eb3', 'i140-other',
    'i129-h1b-new', 'i129-h1b-transfer', 'i129-h1b-extension', 'i129-h1b-amendment', 'i129-l1', 'i129-o1', 'i129-other',
    'i485-family', 'i485-employment', 'i485-asylum', 'i485-diversity', 'i485-other',
    'i130-spouse-citizen', 'i130-parent-citizen', 'i130-child-citizen', 'i130-adult-child-citizen',
    'i130-sibling-citizen', 'i130-family-lpr', 'i130-other',
    'i539-h4', 'i539-f1-j1', 'i539-visitor', 'i539-other',
    'i131-advance-parole', 'i131-reentry', 'i131-refugee', 'i131-other'
  )
);
comment on column public.cases.filing_category is
  'What the case is for, chosen by the owner: I-765 eligibility code (c3b) or a form-prefixed code (i140-eb2niw). Null = not answered.';
