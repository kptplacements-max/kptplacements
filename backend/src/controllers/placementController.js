import Placement from "../models/placementModel.js";

// Utility: recompute totals for a placement document
const recalcTotals = (placement) => {
  let totalStudents = 0;
  let totalPassed = 0;
  let totalPlaced = 0;
  let totalHigher = 0;
  let totalEntrepreneurs = 0;

  placement.programs.forEach((p) => {
    p.passedTotal = p.passedMale + p.passedFemale;
    p.placedTotal = p.placedMale + p.placedFemale;
    p.higherTotal = p.higherMale + p.higherFemale;
    p.dropoutTotal = p.dropoutMale + p.dropoutFemale;

    p.percentageTotal =
      p.total > 0
        ? Number(((p.placedTotal / p.total) * 100).toFixed(2))
        : 0;

    totalStudents += p.total;
    totalPassed += p.passedTotal;
    totalPlaced += p.placedTotal;
    totalHigher += p.higherTotal;
    totalEntrepreneurs += p.entrepreneurMale + p.entrepreneurFemale;
  });

  placement.totalStudents = totalStudents;
  placement.totalPassed = totalPassed;
  placement.totalPlaced = totalPlaced;
  placement.totalHigherStudies = totalHigher;
  placement.totalEntrepreneurs = totalEntrepreneurs;

  placement.overallPercentage =
    totalStudents > 0
      ? Number(((totalPlaced / totalStudents) * 100).toFixed(2))
      : 0;

  return placement;
};

// ✅ CREATE new year data
export const createPlacement = async (req, res) => {
  try {
    const existing = await Placement.findOne({ year: req.body.year });
    if (existing)
      return res
        .status(400)
        .json({
          message: `Placement record for ${req.body.year} already exists`,
        });

    let placement = new Placement(req.body);
    placement = recalcTotals(placement);
    const newData = await placement.save();

    res.status(201).json(newData);
  } catch (error) {
    console.error("Error creating placement:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ all years
export const getAllPlacements = async (req, res) => {
  try {
    const data = await Placement.find({ isPublic: true }).sort({ year: -1 }); // 👈 FILTER
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ one year
export const getPlacementByYear = async (req, res) => {
  try {
    const data = await Placement.findOne({ year: req.params.year });
    if (!data) return res.status(404).json({ message: "No data found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE year data (with recalculation)
export const updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    // Merge updates
    Object.assign(placement, req.body);
    placement = recalcTotals(placement);

    const updated = await placement.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE year entry
export const deletePlacement = async (req, res) => {
  try {
    const deleted = await Placement.findOneAndDelete({ year: req.params.year });
    if (!deleted)
      return res.status(404).json({ message: "Placement year not found" });
    res.json({ message: `Placement data for year ${req.params.year} deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD program to existing year
export const addProgramToYear = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    placement.programs.push(req.body);
    placement = recalcTotals(placement);
    await placement.save();

    res.status(201).json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE program from year
export const deleteProgramFromYear = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    placement.programs = placement.programs.filter(
      (p) => p.program !== req.params.program
    );

    placement = recalcTotals(placement);
    await placement.save();

    res.json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
