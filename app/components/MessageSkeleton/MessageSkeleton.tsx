import React from "react";
import {
  skeletonContainerStyle,
  skeletonLineLarge,
  skeletonLineSmall,
} from "./styles";

export default function MessageSkeleton() {
  return (
    <div style={skeletonContainerStyle}>
      <div className="animate-pulse flex-1 w-full">
        <div style={skeletonLineLarge} />
        <div style={skeletonLineLarge} />
        <div style={skeletonLineSmall} />
      </div>
       <div className="animate-pulse flex-1 w-full">
        <div style={skeletonLineLarge} />
        <div style={skeletonLineLarge} />
        <div style={skeletonLineSmall} />
      </div>
       <div className="animate-pulse flex-1 w-full">
        <div style={skeletonLineLarge} />
        <div style={skeletonLineLarge} />
        <div style={skeletonLineSmall} />
      </div>
    </div>
  );
}
