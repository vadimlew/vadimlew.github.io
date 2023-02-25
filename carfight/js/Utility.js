class Utility {
    static bezier(t, p0=0, p1=0.5, p2=0.5, p3=1) {
        let b = (1 - t)**3*p0 + 3*t*(1-t)**2*p1 + 3*t**2*(1 - t)*p2 + t**3*p3;
        return b;
    }

    static lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}