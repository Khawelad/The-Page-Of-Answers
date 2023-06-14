import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';

const CanvasElement = document.getElementById("canvas"),
CTX = CanvasElement.getContext("2d");

CTX.canvas.width = window.innerWidth;
CTX.canvas.height = window.innerHeight;

const NewShade = (HexColor, Magnitude) => {
    HexColor = HexColor.replace(`#`, ``);
    if (HexColor.length === 6) {
        const DecimalColor = parseInt(HexColor, 16);
        let r = (DecimalColor >> 16) + Magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (DecimalColor & 0x0000ff) + Magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((DecimalColor >> 8) & 0x00ff) + Magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return HexColor;
    }
};

const CandidateColors = ["#e02256", "#eb246a", "#dd1a9c", "#e52524", "#c1e31b", "#dfd816", "#f4bb19", "#f66734", "#2d2d2d"];
const TriangleColor = CandidateColors[Math.floor(Math.random() * CandidateColors.length)];
let FillStyle = [TriangleColor, NewShade(TriangleColor, -10), NewShade(TriangleColor, -20), NewShade(TriangleColor, -30), NewShade(TriangleColor, -40), NewShade(TriangleColor, -50), NewShade(TriangleColor, -60)];
let Points = [];

CTX.fillStyle = TriangleColor;
CTX.fillRect(0, 0, window.innerWidth, window.innerHeight);
CTX.translate(-250, -250);

var PDS = new PoissonDiskSampling({
    shape: [window.innerWidth + 500, window.innerHeight + 500],
    minDistance: Math.floor(Math.random() * 75 + 50),
    maxDistance: Math.floor(Math.random() * 75 + 100),
    tries: 30
});

var CandidatePoints = PDS.fill();
for (let i = 0; i < CandidatePoints.length; i++) {
    Points.push(CandidatePoints[i][0]);
    Points.push(CandidatePoints[i][1]);
}

const Delaunay = new Delaunator(Points);

for (let i = 0; i < Delaunay.triangles.length; i += 3) {
    CTX.fillStyle = FillStyle[Math.floor(Math.random() * FillStyle.length)];
    const pt1 = Delaunay.triangles[i];
    const pt2 = Delaunay.triangles[i + 1];
    const pt3 = Delaunay.triangles[i + 2];
    
    const x1 = Delaunay.coords[2 * pt1];
    const y1 = Delaunay.coords[2 * pt1 + 1];
    const x2 = Delaunay.coords[2 * pt2];
    const y2 = Delaunay.coords[2 * pt2 + 1];
    const x3 = Delaunay.coords[2 * pt3];
    const y3 = Delaunay.coords[2 * pt3 + 1];
    
    CTX.beginPath();
    CTX.moveTo(x1, y1);
    CTX.lineTo(x2, y2);
    CTX.lineTo(x3, y3);
    CTX.closePath();
    CTX.fill();
}

const H1 = document.querySelector("#AnswerHeader");

fetch('./Answers.json')
  .then(res => res.json())
  .then(data => {
    H1.innerText = data.Answers[Math.floor(Math.random() * data.Answers.length)]["Answer"];
  })
  .catch(err => console.log(err));




