import {
  calculateCoordinateDiff,
  reconstructCoordinateDiff,
  DEG_PER_METER,
} from "../src/spherical";

describe("Spherical coordinate utilities", () => {
  describe("calculateCoordinateDiff", () => {
    test("should calculate diff for same coordinates", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5665, lng: 126.978 };
      const diff = calculateCoordinateDiff({ center, target });
      
      expect(diff.lat).toBe(0);
      expect(diff.lng).toBe(0);
    });

    test("should calculate diff for coordinates 1 degree north", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 38.5665, lng: 126.978 };
      const diff = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 1,
      });

      // 1 degree latitude ≈ 111000 meters
      expect(diff.lat).toBeCloseTo(111000, -2);
      expect(diff.lng).toBe(0);
    });

    test("should calculate diff for coordinates 1 degree east", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5665, lng: 127.978 };
      const diff = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 1,
      });

      expect(diff.lat).toBe(0);
      // Longitude distance varies with latitude
      expect(diff.lng).toBeGreaterThan(0);
    });

    test("should handle custom precision", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5695, lng: 126.981 }; // ~333m north, ~237m east
      
      const diff3m = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 3,
      });
      const diff10m = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 10,
      });

      // With 3m precision, indices should be larger
      expect(Math.abs(diff3m.lat)).toBeGreaterThan(Math.abs(diff10m.lat));
      expect(Math.abs(diff3m.lng)).toBeGreaterThan(Math.abs(diff10m.lng));
    });

    test("should handle negative differences (south and west)", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5635, lng: 126.975 }; // south and west
      const diff = calculateCoordinateDiff({ center, target });

      expect(diff.lat).toBeLessThan(0);
      expect(diff.lng).toBeLessThan(0);
    });

    test("should handle custom degreePerMeter", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.6, lng: 127.0 }; // Larger difference for clearer test
      
      const diff1 = calculateCoordinateDiff({
        center,
        target,
        degreePerMeter: 111000,
        precisionMeters: 1,
      });
      const diff2 = calculateCoordinateDiff({
        center,
        target,
        degreePerMeter: 100000, // More significant difference
        precisionMeters: 1,
      });

      // Different conversion factors should yield different results
      expect(diff1.lat).not.toBe(diff2.lat);
      expect(diff1.lng).not.toBe(diff2.lng);
    });

    test("should work with equator coordinates", () => {
      const center = { lat: 0, lng: 0 };
      const target = { lat: 0.001, lng: 0.001 };
      const diff = calculateCoordinateDiff({ center, target });

      expect(diff.lat).toBeGreaterThan(0);
      expect(diff.lng).toBeGreaterThan(0);
    });

    test("should work with high latitude coordinates", () => {
      const center = { lat: 80, lng: 0 };
      const target = { lat: 80, lng: 1 };
      const diff = calculateCoordinateDiff({ center, target });

      expect(diff.lat).toBe(0);
      // At high latitudes, longitude distance is much smaller
      expect(diff.lng).toBeGreaterThan(0);
    });
  });

  describe("reconstructCoordinateDiff", () => {
    test("should reconstruct original coordinates from diff", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5695, lng: 126.981 };
      
      const diff = calculateCoordinateDiff({ center, target });
      const reconstructed = reconstructCoordinateDiff({ center, diff });

      expect(reconstructed.lat).toBeCloseTo(target.lat, 4);
      expect(reconstructed.lng).toBeCloseTo(target.lng, 4);
    });

    test("should handle zero diff", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const diff = { lat: 0, lng: 0 };
      const reconstructed = reconstructCoordinateDiff({ center, diff });

      expect(reconstructed.lat).toBeCloseTo(center.lat, 6);
      expect(reconstructed.lng).toBeCloseTo(center.lng, 6);
    });

    test("should handle negative diff", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const diff = { lat: -100, lng: -100 };
      const reconstructed = reconstructCoordinateDiff({
        center,
        diff,
        precisionMeters: 3,
      });

      expect(reconstructed.lat).toBeLessThan(center.lat);
      expect(reconstructed.lng).toBeLessThan(center.lng);
    });

    test("should work with custom precision", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const diff = { lat: 100, lng: 100 };
      
      const reconstructed3m = reconstructCoordinateDiff({
        center,
        diff,
        precisionMeters: 3,
      });
      const reconstructed10m = reconstructCoordinateDiff({
        center,
        diff,
        precisionMeters: 10,
      });

      // Larger precision should result in larger coordinate differences
      expect(reconstructed10m.lat - center.lat).toBeGreaterThan(
        reconstructed3m.lat - center.lat
      );
    });

    test("should work with custom degreePerMeter", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const diff = { lat: 100, lng: 100 };
      
      const reconstructed1 = reconstructCoordinateDiff({
        center,
        diff,
        degreePerMeter: 111000,
      });
      const reconstructed2 = reconstructCoordinateDiff({
        center,
        diff,
        degreePerMeter: 110000,
      });

      expect(reconstructed1.lat).not.toBe(reconstructed2.lat);
    });
  });

  describe("Roundtrip conversion", () => {
    test("should maintain accuracy through calculate -> reconstruct cycle", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const targets = [
        { lat: 37.5695, lng: 126.981 },
        { lat: 37.5635, lng: 126.975 },
        { lat: 37.5665, lng: 126.978 },
        { lat: 37.6, lng: 127.0 },
        { lat: 37.5, lng: 126.9 },
      ];

      targets.forEach((target) => {
        const diff = calculateCoordinateDiff({
          center,
          target,
          precisionMeters: 3,
        });
        const reconstructed = reconstructCoordinateDiff({
          center,
          diff,
          precisionMeters: 3,
        });

        // Should be close to original (within precision tolerance)
        expect(reconstructed.lat).toBeCloseTo(target.lat, 4);
        expect(reconstructed.lng).toBeCloseTo(target.lng, 4);
      });
    });

    test("should handle multiple precision levels", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 37.5695, lng: 126.981 };
      const precisions = [1, 3, 5, 10, 50, 100];

      precisions.forEach((precision) => {
        const diff = calculateCoordinateDiff({
          center,
          target,
          precisionMeters: precision,
        });
        const reconstructed = reconstructCoordinateDiff({
          center,
          diff,
          precisionMeters: precision,
        });

        // Accuracy depends on precision
        const latError = Math.abs(reconstructed.lat - target.lat);
        const lngError = Math.abs(reconstructed.lng - target.lng);
        
        // Error should be within reasonable bounds based on precision
        expect(latError).toBeLessThan(precision / DEG_PER_METER * 2);
        expect(lngError).toBeLessThan(precision / DEG_PER_METER * 2);
      });
    });

    test("should work at different latitudes", () => {
      const testCases = [
        { lat: 0, lng: 0 }, // Equator
        { lat: 45, lng: 90 }, // Mid latitude
        { lat: 60, lng: -120 }, // High latitude
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 51.5074, lng: -0.1278 }, // London
      ];

      testCases.forEach((center) => {
        const target = { lat: center.lat + 0.01, lng: center.lng + 0.01 };
        const diff = calculateCoordinateDiff({ center, target });
        const reconstructed = reconstructCoordinateDiff({ center, diff });

        expect(reconstructed.lat).toBeCloseTo(target.lat, 4);
        expect(reconstructed.lng).toBeCloseTo(target.lng, 4);
      });
    });
  });

  describe("DEG_PER_METER constant", () => {
    test("should be defined and have correct value", () => {
      expect(DEG_PER_METER).toBe(111000);
    });

    test("should be used as default parameter", () => {
      const center = { lat: 37.5665, lng: 126.978 };
      const target = { lat: 38.5665, lng: 126.978 };
      
      const diffDefault = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 1,
      });
      const diffExplicit = calculateCoordinateDiff({
        center,
        target,
        precisionMeters: 1,
        degreePerMeter: DEG_PER_METER,
      });

      expect(diffDefault.lat).toBe(diffExplicit.lat);
      expect(diffDefault.lng).toBe(diffExplicit.lng);
    });
  });
});
