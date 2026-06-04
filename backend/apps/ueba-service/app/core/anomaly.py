import math

def anomaly_score(
    current: float,
    baseline: float,
    stddev: float = 0.0,
    direction_sensitive: bool = True,
) -> int:
    """
    SIEM-style anomaly score from 0–100.

    Factors:
      - Deviation magnitude via z-score (not raw ratio)
      - Logarithmic scaling so extreme spikes don't dominate
      - Direction sensitivity: drops below baseline are less alarming
        than spikes above it (configurable)
      - Volatility dampening: if the baseline is already noisy,
        we trust deviations less
    """
    # Edge case: no baseline to compare against
    if baseline == 0:
        return 100 if current > 0 else 0

    # --- Step 1: Deviation ratio (z-score style) ---
    # Normalise by stddev so we're measuring in units of "how unusual is this
    # relative to the normal spread", not just raw magnitude.
    # Floor stddev at 1 to avoid divide-by-zero on rock-stable baselines.
    effective_stddev = max(stddev, 1.0)
    deviation = current - baseline
    ratio = deviation / effective_stddev   # signed z-score

    # --- Step 2: Logarithmic magnitude scaling ---
    # log₁₀(1 + |ratio|) normalised so that |ratio|=10 (10σ spike) → 100.
    # This compresses extreme outliers instead of letting a 100× spike
    # dwarf every other signal on the dashboard.
    magnitude = abs(ratio)
    raw_score = (math.log10(1 + magnitude) / math.log10(11)) * 100

    # --- Step 3: Direction multiplier ---
    # In most SIEM contexts an unexpected *drop* (e.g. sudden silence on a
    # health-check) is concerning but less so than a spike (e.g. traffic
    # flood, failed login surge).  Downward deviations are weighted at 70 %.
    if direction_sensitive and deviation < 0:
        raw_score *= 0.7

    # --- Step 4: Volatility dampening ---
    # If the baseline itself is highly erratic (coefficient of variation > 1),
    # small absolute deviations are normal noise — reduce confidence in the score.
    if baseline > 0:
        cv = effective_stddev / baseline   # coefficient of variation
        if cv > 1.0:
            raw_score *= 0.8

    return min(100, round(raw_score))
