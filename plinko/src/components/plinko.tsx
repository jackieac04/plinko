import { useEffect, useRef } from "react";
import "../App.css";

const Plinko = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ball properties
    const ball = {
      x: 200,
      y: 127,
      radius: 30,
      color: "blue",
      restitution: 0.4,
      dy: 2,
      dx: 2,
    };

    const plinkos = () => {
      const plinks = [];
      for (let i = 1; i < 12; i++) {
        const plink = {
          x: 150 * i,
          y: 300,
          radius: 20,
          color: "red",
          restitution: 0.5,
          dy: 2,
        };
        plinks.push(plink);
      }
      for (let i = 0; i < 11; i++) {
        const plink = {
          x: 150 * i + 170,
          y: 400,
          radius: 20,
          color: "red",
          restitution: 0.5,
          dy: 2,
        };
        plinks.push(plink);
      }
      for (let i = 0; i < 11; i++) {
        const plink = {
          x: 150 * i + 120,
          y: 500,
          radius: 20,
          color: "red",
          restitution: 0.5,
          dy: 2,
        };
        plinks.push(plink);
      }
      return plinks;
    };

    // Left slide properties (angled)
    const slideLeft = {
      points: [
        { x: 100, y: 120 }, //upper left
        { x: 100, y: 145 }, //lower left
        { x: 300, y: 235 }, //lower right
        { x: 300, y: 210 }, //upper right
      ],
      color: "gray",
    };

    // // right slide properties (angled)
    // const slideRight = {
    //   points: [
    //     { x: 1000, y: 200 }, //uper left
    //     { x: 1000, y: 250 }, //lower left
    //     { x: 1200, y: 200 }, //lower right?
    //     { x: 1200, y: 150 }, //upper right
    //   ],
    //   color: "gray",
    // };

    // Ground properties
    const ground = { x: 400, y: 700, width: 2000, height: 20, color: "gray" };

    // Buckets properties
    const buckets = [
      { x: 150, y: 640, width: 50, height: 100, color: "green" },
      { x: 400, y: 640, width: 50, height: 100, color: "green" },
      { x: 650, y: 640, width: 50, height: 100, color: "green" },
      { x: 900, y: 640, width: 50, height: 100, color: "green" },
      { x: 1100, y: 640, width: 50, height: 100, color: "green" },
    ];

    const drawCircle = (x, y, radius, color) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawPolygon = (points, color) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawRect = (x, y, width, height, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    };

    const update = () => {
      // Move the ball
      //move right and down until reaches 300? x
      //roll down slide
      if (ball.x < 320 && ball.y < 290) {
        ball.x += ball.dy;
        ball.y += ball.dy - 1;
        // bounce off first || bounce of second towards third
      } else if (ball.y < 290 || (ball.y >= 360 && ball.y <= 450)) {
        ball.y += ball.dy + 0.5;
        ball.x += ball.dy;
        //go left, bounce of second row
      } else if (ball.y >= 290 && ball.y < 360) {
        ball.y += ball.dy + 0.5;
        ball.x += -ball.dx;
        // go right off third
      } else if (ball.y > 450 && ball.y < 470 && ball.x < 440) {
        ball.x += ball.dx;
        //fall towards bucket
      } else if (ball.x >= 440 && ball.y > 450 && ball.y < 610) {
        ball.y += ball.dy;
        ball.x += ball.dy;
        //bounce off bucket
      } else if (ball.y >= 610 && ball.y + ball.radius < ground.y) {
        ball.x -= ball.dx;
        ball.y += ball.dy;
      }

      // Bounce the ball off the ground
      if (ball.y + ball.radius > ground.y) {
        ball.dy *= -ball.restitution;
      }

      // Draw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
      const plinkies = plinkos();
      plinkies.forEach((plink) => {
        drawCircle(plink.x, plink.y, plink.radius, plink.color);
      });
      drawPolygon(slideLeft.points, slideLeft.color);
      // drawPolygon(slideRight.points, slideRight.color);
      drawRect(
        ground.x - ground.width / 2,
        ground.y - ground.height / 2,
        ground.width,
        ground.height,
        ground.color
      );
      buckets.forEach((bucket) =>
        drawRect(
          bucket.x - bucket.width / 2,
          bucket.y - bucket.height / 2,
          bucket.width,
          bucket.height,
          bucket.color
        )
      );

      requestAnimationFrame(update);
    };

    update(); // Start animation loop

    // Clean up
    return () => cancelAnimationFrame(update);
  }, []);

  return <canvas ref={canvasRef} width="1300" height="700" />;
};

export default Plinko;
