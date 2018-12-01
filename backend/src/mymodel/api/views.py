from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from mymodel.models import MyModel
from reactdjango.settings import BASE_DIR
from rest_framework.response import Response
import subprocess
import re
import json


class MyModelListView(APIView):
    queryset = MyModel.objects.all()

    def get(self, request, format=None):
        file1 = open(BASE_DIR + "/mymodel/api/Media/MSNBC.txt")
        sup_set = open(BASE_DIR + "/mymodel/api/Media/support_set.json")
        print(type(sup_set))
        file2 = open(BASE_DIR + "/mymodel/api/Media/support_set2.json")
        dataset2 = json.load(file2)
        print(type(dataset2))
        patterns = self.Vmsp()
        supp_set_idx = {i: [] for i in range(1, len(patterns) + 1)}
        max_patt_idx = 0
        for pattern in patterns:
            regex = "^([0-9,*,#]+ +)*" + \
                " ([0-9,*,#]+ +)*".join(pattern) + " ([0-9,*,#, ]+)*$"
            max_patt_idx += 1
            seq_idx = 0
            file1.seek(0)
            for seq in file1:
                seq_idx += 1
                seq = seq.replace("-1", "*")
                seq = seq.replace("-2", "#")
                obj = re.search(regex, seq)
                if obj:
                    supp_set_idx[max_patt_idx].append(seq_idx)
                else:
                    continue

        total_number_seq = 31790
        event_supp = {}
        seq_idx = 0

        # computing jaccard index
        j_index_list = []
        for key in supp_set_idx:
            temp = []
            for key1 in supp_set_idx:
                set1 = set(supp_set_idx[key])
                set2 = set(supp_set_idx[key1])
                if set1 & set2:
                    numerator = len(set1 & set2)
                    denominator = len(set1) + len(set2) - numerator
                    j_val = numerator / denominator
                else:
                    j_val = 0
                temp.append(j_val)
            j_index_list.append(temp)

        print("\n")
        print("================ Jaccard Index Matrix ================\n")
        print("\n")
        print(j_index_list)

        # pattern pruning logic
        print("\n")
        print("================= Pruned Patterns =====================\n")
        flag = -1
        final_patt = []
        threshold = 0.5
        final_patt.append(list(patterns[0]))
        for patt in range(1, len(patterns)):
            flag = 0
            for f_patt in range(len(final_patt)):
                if j_index_list[patt][f_patt] > threshold:
                    flag = -1
            if flag == 0:
                final_patt.append(list(patterns[patt]))

        print(final_patt)

        print("\n===================== Event Support ====================\n")
       # Computes Event Support
        for pattern in final_patt:
            seq_idx += 1
            event_supp[seq_idx] = []
            for x in range(1, len(pattern) + 1):
                s = pattern[0:x]
                regex = "^([0-9,*,#]+ +)*" + \
                    " ([0-9,*,#]+ +)*".join(s) + " ([0-9,*,#, ]+)*$"
                file1.seek(0)
                count = 0
                for seq in file1:
                    seq = seq.replace("-1", "*")
                    seq = seq.replace("-2", "#")
                    result = re.search(regex, seq)
                    if result:
                        count += 1
                event_supp[seq_idx].append((count * 100) / total_number_seq)
        pruned_patterns2 = dataset2["pruned_patterns"]
        event_supp2 = dataset2["event_support"]
        supp_set2 = dataset2["support_set"]
        final = {'pruned_patterns': final_patt,
                 'event_support': event_supp, 'individual_support_sets': sup_set,
                 "pruned_patterns_2":pruned_patterns2, "event_support_2":event_supp2, "individual_support_set_2":supp_set2}
        return Response(final)

    def Vmsp(self):
        min_supp = 0.3
        executable = BASE_DIR + "/mymodel/Executable/spmf.jar"
        print(executable)
        input_file = BASE_DIR + "/mymodel/api/Media/MSNBC.txt"
        output_file = BASE_DIR + "/mymodel/api/Media/output.txt"
        subprocess.call(["java", "-jar", executable, "run", "VMSP",
                         input_file, output_file, str(min_supp)])
        lines = []
        try:
            with open(output_file, "rU") as f:
                lines = f.readlines()
        except:
            print("read_output error")
        patterns = []
        for line in lines:
            line = line.strip()
            temp = line.split(" -1 ")
            patterns.append(temp[0:len(temp) - 1])
        print(patterns)

        return patterns
