import React from 'react';
import TopToolbar from '@/components/whiteboard/TopToolbar';
import LeftSidebar from '@/components/whiteboard/LeftSidebar';
import Canvas from '@/components/whiteboard/Canvas';
import BottomPanel from '@/components/whiteboard/BottomPanel';
import PageNavigation from '@/components/whiteboard/PageNavigation';

const Index: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopToolbar />
      <PageNavigation />
      <div className="flex flex-1 min-h-0">
        <LeftSidebar />
        <Canvas />
      </div>
      <BottomPanel />
    </div>
  );
};

export default Index;
