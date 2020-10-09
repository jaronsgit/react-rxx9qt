import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";

const options = {
  physics: {
    enabled: true,
    forceAtlas2Based: {
      gravitationalConstant: -50000,
      centralGravity: 0.0,
      springConstant: 0.08,
      springLength: 100,
      damping: 0,
      avoidOverlap: 1
    }
  },
  autoResize: true,
  edges: {
    color: "#000000",
    //smooth: true
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 1
    },
    physics: true
  },
  nodes: {
    shape: "box",
    color: "rgba(97,195,238,0.5)",
    font: { size: 14, strokeWidth: 4, strokeColor: "white" },
    widthConstraint: {
      minimum: 60,
      maximum: 60
    },
    heightConstraint: {
      minimum: 30
    }
  },
  height: "500px",
  interaction: { hover: true }
};

const events = {
  select: function (event) {
    var { nodes, edges } = event;
    console.log(nodes, edges);
  }
};

const NewGraphVisualisation = ({ width, height, graphData: data, ...rest }) => {
  const [graphData, setGraphData] = useState(data);

  useEffect(() => {
    setGraphData(data);
  }, [data]);

  return (
    <Graph
      graph={graphData}
      options={options}
      events={events}
      style={{ width: width, height: height }}
      {...rest}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        /*network.on("beforeDrawing", function (ctx) {
          for (let node of graphData.nodes) {
            if (node.type === "node") {
              let nodeId = node.id;
              let nodePosition = network.getPositions([nodeId]);
              ctx.strokeStyle = "#A6D5F7";
              ctx.fillStyle = "#294475";
              ctx.lineWidth = 3;

              let nodeBoundingBox = network.getBoundingBox(nodeId);
              console.log(nodePosition[nodeId]);

              ctx.beginPath();
              ctx.moveTo(
                nodePosition[nodeId].x - 40,
                nodeBoundingBox.bottom + 5
              );
              ctx.lineTo(nodePosition[nodeId].x - 40, nodeBoundingBox.bottom);
              ctx.lineTo(
                nodePosition[nodeId].x +
                  40 +
                  60 * (node.anchors.end - node.anchors.from),
                nodeBoundingBox.bottom
              );
              ctx.lineTo(
                nodePosition[nodeId].x +
                  40 +
                  60 * (node.anchors.end - node.anchors.from),
                nodeBoundingBox.bottom + 5
              );

              ctx.stroke();
              //ctx.fill();
              //ctx.stroke();
            }
          }
        });*/
      }}
    />
  );
};

export default NewGraphVisualisation;
