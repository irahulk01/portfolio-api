import Visit from '../models/Visit.js';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : null;

const getOrCreateVisit = async (update = {}) =>
  Visit.findByIdAndUpdate(
    'portfolio_visits',
    { ...update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

export const getVisitCount = async (req, res) => {
  try {
    const visit = await getOrCreateVisit();
    res.json({
      count: visit.count,
      updatedAt: formatDate(visit.updatedAt),
    });
  } catch (err) {
    console.error('getVisitCount error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const incrementVisit = async (req, res) => {
  const by = Number(req.body?.by ?? 1);
  if (!Number.isFinite(by)) {
    return res.status(400).json({ error: '`by` must be a finite number' });
  }

  try {
    const visit = await getOrCreateVisit({
      $inc: { count: by },
      $set: { updatedAt: new Date() },
    });

    res.json({
      count: visit.count,
      updatedAt: formatDate(visit.updatedAt),
    });
  } catch (err) {
    console.error('incrementVisit error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const setVisitCount = async (req, res) => {
  const value = Number(req.body?.count);
  if (!Number.isFinite(value)) {
    return res
      .status(400)
      .json({ error: '`count` is required and must be a finite number' });
  }

  try {
    const visit = await getOrCreateVisit({
      count: Math.max(0, Math.trunc(value)),
      updatedAt: new Date(),
    });

    res.json({
      count: visit.count,
      updatedAt: formatDate(visit.updatedAt),
    });
  } catch (err) {
    console.error('setVisitCount error:', err);
    res.status(500).json({ error: err.message });
  }
};
