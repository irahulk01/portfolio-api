import Visit from '../models/Visit.js';

export const getVisitCount = async (req, res) => {
  try {
    let visit = await Visit.findById('portfolio_visits');

    if (!visit) {
      visit = await Visit.create({ _id: 'portfolio_visits', count: 0 });
    }

    const formattedUpdatedAt = visit.updatedAt
      ? new Date(visit.updatedAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      : null;

    res.json({
      count: visit.count,
      updatedAt: formattedUpdatedAt,
    });
  } catch (err) {
    console.error('getVisitCount error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const incrementVisit = async (req, res) => {
  const incBy = Number(req.body.by ?? 1);
  if (Number.isNaN(incBy) || !Number.isFinite(incBy)) {
    return res.status(400).json({ error: '`by` must be a finite number' });
  }

  try {
    const visit = await Visit.findByIdAndUpdate(
      'portfolio_visits',
      { $inc: { count: incBy }, $set: { updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json({
      count: visit.count,
      updatedAt: new Date(visit.updatedAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    });
  } catch (err) {
    console.error('incrementVisit error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const setVisitCount = async (req, res) => {
  const { count } = req.body;
  const numeric = Number(count);
  if (typeof count === 'undefined' || Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return res.status(400).json({ error: '`count` is required and must be a finite number' });
  }

  try {
    const visit = await Visit.findByIdAndUpdate(
      'portfolio_visits',
      { count: Math.max(0, Math.trunc(numeric)), updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      count: visit.count,
      updatedAt: new Date(visit.updatedAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    });
  } catch (err) {
    console.error('setVisitCount error:', err);
    res.status(500).json({ error: err.message });
  }
};
