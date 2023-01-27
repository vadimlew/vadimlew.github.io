class Utility {
    static bezier1(t, p1=0, p2=1) {
        let p = (1 - t)*p1 + t*p2;
        return p;
    }

    static bezier2(t, p1=0, p2=0.5, p3=1) {
        let p = (1 - t)**2*p1 + 2*t*(1-t)*p2 + t**2*p3;
        return p;
    }

    static bezier3(t, p1=0, p2=0.5, p3=0.5, p4=1) {
        let p = (1 - t)**3*p1 + 3*t*(1-t)**2*p2 + 3*t**2*(1 - t)*p3 + t**3*p4;
        return p;
    }
}