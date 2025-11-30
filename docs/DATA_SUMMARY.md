# Competition Training Data Summary

**Generated:** Nov 30, 2025
**Data Source:** `data/raw/competition_train.jsonl`

## Overview

- **Total Examples:** 42,031
- **Format:** JSONL (one JSON object per line)
- **Fields:** `user_id`, `text`, `type`, `category_labels`

## Data Structure

```json
{
  "user_id": "44",
  "text": "Just got back from the gaming convention...",
  "type": "post",
  "category_labels": ["gamergate"]
}
```

## Category Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| bullying | 4,416 | 10.51% |
| recovery_ed | 4,250 | 10.11% |
| conspiracy | 4,006 | 9.53% |
| benign | 3,996 | 9.51% |
| incel_misogyny | 3,220 | 7.66% |
| gamergate | 3,171 | 7.54% |
| alpha | 3,123 | 7.43% |
| pro_ana | 3,069 | 7.30% |
| extremist | 3,053 | 7.26% |
| misinfo | 2,992 | 7.12% |
| ed_risk | 2,951 | 7.02% |
| hate_speech | 2,922 | 6.95% |
| trad | 2,920 | 6.95% |

**Total category labels:** 44,089 (some examples have multiple labels)

## Key Observations

### Multi-Label Examples
Some posts have multiple category labels (e.g., `["incel_misogyny", "bullying"]`), indicating overlapping harmful behaviors.

### Categories Relevant to Our Solution

**Harmful/Risk Categories** (to detect and moderate):
- **incel_misogyny** - Core target for de-radicalization intervention
- **bullying** - Needs moderation
- **hate_speech** - Immediate moderation
- **extremist** - High-risk content
- **alpha** - "Alpha male" toxic masculinity content
- **trad** - Traditional/reactionary gender views
- **gamergate** - Online harassment campaigns
- **ed_risk** - Eating disorder risk behaviors
- **pro_ana** - Pro-eating disorder content

**Helpful Categories** (potential mentor content):
- **recovery_ed** - Eating disorder recovery stories (positive peer support examples!)
- **benign** - Normal, healthy interactions

**Other Categories**:
- **conspiracy** - Conspiracy theories and misinformation
- **misinfo** - General misinformation

### Our Use Cases

1. **Content Moderation** - Use classifier to filter harmful content before showing to users
2. **Theme Detection** - Identify what users are struggling with (loneliness, relationships, etc.)
3. **Mentor Post Screening** - Ensure mentor posts are constructive (recovery_ed, benign)
4. **Risk Assessment** - Flag high-risk users for additional support

## Category Examples

### incel_misogyny
> "Foid trap alert! Don't fall for the lies, guys. I've been there, done that, and got the t-shirt. Wake up, sheeple! #FraudAlert #RedPillWisdom See the truth now"

### recovery_ed (POSITIVE - potential mentor content)
> "Hey everyone, I'm so excited to kick off this new thread about ED recovery! Let's talk about setting healthy boundaries and finding joyful movement in our daily lives. I've been working on this myself and I'd love to hear about your experiences too! #mentalhealthmatters"

### benign (POSITIVE - healthy interaction)
> "Hey everyone, I'm Liam! I'm a huge fan of sports, tech, and trying out new hobbies. When I'm not online, you can find me playing basketball or trying out a new recipe in the kitchen. I'm excited to be a part of this community and learn more about your interests! #newbeginnings #communityfirst it's okay to ask for help—that's real courage"

### bullying
> "Hey, you think you're so tough? Just a scaredy-pants trying to hide behind a screen. I'm here to call you out, @username! #BulliesUnite #ScaredyPantsSquad there's no point in you continuing"

### extremist
> "IT'S TIME TO UNLEASH THE FURY! The system is crumbling, and it's time for the revolution to SPARK! We must not be held back by the chains of oppression. Let the storm of resistance begin! #RevolutionNow BURN IT ALL DOWN NOW"

### conspiracy
> "Just got my hands on some explosive info about the Zelensky actor 🤔. It's clear the deep state is controlling the narrative. Stay tuned for more updates on the frazzledrip saga... #TheTruthIsOutThere #FollowTheMoney"

### alpha
> "Welcome to my channel, where I'll be sharing my expertise on how to become a high-value male and dominate the dating market. As a veteran of this community, I've seen it all and I'm here to guide you through the process. Stay tuned for my high-value sermon on the importance of suifuel and framemog in attracting women. #highvaluemale #suifuel #framemog abundance mentality is the key"

## Next Steps

1. **Load data in notebook** - Updated `notebooks/01_exploration.ipynb` to load this data
2. **Build classifier** - Test approaches in `notebooks/02_classification.ipynb`
   - Approach 1: Keyword/pattern matching (fast baseline)
   - Approach 2: Perspective API (toxicity scores)
   - Approach 3: LLM classification (Groq API)
   - Approach 4: Embeddings + clustering
3. **Set up Groq API** - For fast, cost-effective LLM classification
4. **Curate mentor posts** - Find real examples from r/IncelExit or create from recovery_ed examples

## Technical Notes

- **Data format:** JSONL (newline-delimited JSON)
- **Encoding:** UTF-8
- **Multi-label:** ~10-15% of examples have multiple category labels
- **Balance:** Reasonably balanced across categories (6-10% each)
- **Quality:** Appears to be synthetic/generated data (part of hackathon challenge)
